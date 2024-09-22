import "isomorphic-fetch";
import * as vscode from "vscode";
import { changelog, disambiguation, makeSelect } from "./prompts";

interface ChatResult extends vscode.ChatResult {
  metadata: {
    command: string;
  };
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vui-agent" is now active!');

  const handler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
  ): Promise<ChatResult> => {
    try {
      const userQuery = request.prompt;
      console.log("userQuery", userQuery);
      const userCommand = request.command;
      console.log("userCommand", userCommand);

      const [model] = await vscode.lm.selectChatModels({
        vendor: "copilot",
        family: "gpt-4o",
      });

      if (request.command === "latestVersion") {
        console.log("Inside the latest version command");
        stream.progress("Fetching the changelog...");
        const req = await fetch("https://registry.npmjs.com/@veracity/vui", {
          headers: {
            "content-type": "application/json",
          },
        });
        if (!req.ok) {
          throw new Error(req.statusText);
        }
        const res = (await req.json()) as {
          "dist-tags": { beta: string; latest: string };
        };

        const messages = [
          vscode.LanguageModelChatMessage.User(changelog),
          vscode.LanguageModelChatMessage.User(
            `The latest version is ${res["dist-tags"].latest}. The current version is v2.25.0`
          ),
        ];
				const chatRequest = await model.sendRequest(messages, undefined, token);
				for await (const message of chatRequest.text) {
					stream.markdown(message);
				}
				stream.button({
					command: 'vui-agent.openChangelog',
					title: 'Open Full Changelog'
				});
				stream.button({
					command: 'vui-agent.updatePackageJson',
					title: 'Update package.json',
					arguments: [res["dist-tags"].latest]
				});

				return { metadata: { command: 'latestVersion' } };
      }

      const messages = [
        vscode.LanguageModelChatMessage.User(disambiguation),
        vscode.LanguageModelChatMessage.User(changelog),
        vscode.LanguageModelChatMessage.User(makeSelect),
        vscode.LanguageModelChatMessage.User(`If it's useful, this is the current text from the user: \`${getSelectedText()}\``),
        vscode.LanguageModelChatMessage.User(userQuery),
      ];
      const chatRequest = await model.sendRequest(messages, undefined, token);
      for await (const message of chatRequest.text) {
        stream.markdown(message);
      }

      return { metadata: { command: "" } };
    } catch (err) {
      if (err instanceof vscode.LanguageModelError) {
        console.log(err.message, err.code, err.cause);
        if (
          err.cause instanceof Error &&
          err.cause.message.includes("off_topic")
        ) {
          stream.markdown(
            vscode.l10n.t(
              "I'm sorry, I can only explain computer science concepts."
            )
          );
        }
      } else {
        // add other error handling logic
        throw err;
      }
    }
    return { metadata: { command: "" } };
  };

  const agent = vscode.chat.createChatParticipant("vui-agent", handler);

  agent.iconPath = vscode.Uri.joinPath(context.extensionUri, "cat.jpeg");

	const openChangelog = vscode.commands.registerCommand(
    "vui-agent.openChangelog",
    () => {
      vscode.env.openExternal(vscode.Uri.parse('https://ui.veracity.com/?path=/docs/guides-changelog--docs'));
    }
  );

	const updatePackageJson = vscode.commands.registerCommand(
    "vui-agent.updatePackageJson",
    (version) => {
			console.log('updatePackageJson version', version);
      vscode.window.showInformationMessage(`Not implement yet!`);
    }
  );

  const versionCmd = vscode.commands.registerCommand(
    "vui-agent.latestVersion",
    async () => {
      try {
        const req = await fetch("https://registry.npmjs.com/@veracity/vui", {
          headers: {
            "content-type": "application/json",
          },
        });
        if (!req.ok) {
          throw new Error(req.statusText);
        }
        const res = (await req.json()) as {
          "dist-tags": { beta: string; latest: string };
        };
        vscode.window.showInformationMessage(
          `Latest VUI is ${res["dist-tags"].latest}`
        );
      } catch (e: any) {
        vscode.window.showErrorMessage("Failed to get VUI latest version.");
        throw e;
      }
    }
  );

  context.subscriptions.push(openChangelog, updatePackageJson, versionCmd);
}

function getSelectedText() {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection); // This will get the selected text
			return selectedText;
	}
	return null;
}


export function deactivate() {}
