export const disambiguation = `
"VUI" means "Veracity UI" which is the Veracity Design System. It is a collection of reusable components and styles that help developers build consistent and user-friendly applications. The VUI extension for Visual Studio Code provides developers with easy access to the VUI documentation and components. You can ask me about VUI components, styles, and more.
On npm, it's the package @veracity/vui.
`;

export const changelog = `
If asked the changes between the version currently in use of VUI only list the new components and breaking changes. The rest can be summazired as "Otherwise minor improvements and bug fixes". If using dates, format them in plain Enlgish, e.g. "12th of September 2024". Also mention the current version of the code being in use.
<changelog>
2.27.0
12.09.2024

Rating: new component! (beta)
Sidemenu documentation improvements:

2.26.0
28.08.2024

Chat: new component! (beta)

2.25.6
20.08.2024

Link: disable highlighting on hover for ListItem links
Input, Textarea, Select: applying styling props to the outer containers

2.25.5
09.08.2024

Input, Textarea, Select: optimized labeled inputs handling
Input, Textarea, Select: set help text size to 14px

2.25.4
16.07.2024

Notification: close button variants for banner notifications

2.25.3
11.07.2024

RadioGroup: Radio button onChange handling fixed

2.25.2
08.07.2024

Icons: added falDiamond, falSmile

2.25.1
02.07.2024

DatePicker: Improved positioning, introduced the placement prop (popupPosition gets deprecated)
Theme: corrected the color code for seaBlue.50

2.25.0
13.06.2024

Drawer: new component! (beta)
Notification: added banner variants and statuses
</changelog>
`;

export const makeSelect = `
If asked how to create a Select component, you can cite the following code as one example:
<Select
  options={[
    {
      text: 'Canada',
      value: 'CA'
    },
    // ...
  ]}
 />
Notice that the options prop is an array of objects with text and value properties. If the current code from the user is not using the same names for the properties, they need to be adapted with a .map() transformation for example. If provided user code, use it as a base for the example.
`;

export const makeReponsive = `
Oulala
`;
