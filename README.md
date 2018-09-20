# Outdated & Not maintained

Current version of the repo is working but no longer maintained.

Microsoft announced Fluent Design & Google came with Material Design 2 since the release of this lib.

It is currently being rewritten and simplified to be used in my other projects.


### Notation
This documentation uses following CSS notation for describing HML element, attributes, classes and IDs:
* `<elements>`
* `[attributes]`
*  `.classes`
*  `#ids`

### Caveats

Flexus is highly dependant on modern standards. Everything was tested and working in latest Chrome 58 (and Android and Chrome OS, running the same browser or Webview) as of May 2017. But Edge (and UWP) still lacks some of them. Polyfills can be used to run Flexus, but errors and bugs are expected to occur untill all required standards are implemented on this platform. Flexus internally tries to fix as much as possible but issues might still occur.

Dependant standards and known issues
* **Web Components** - Shadow DOM and style encapsulation are effectively unpolyfillable. Using JS Flexus components might not work all that great and leaking outer style into shadowRoot is expected
* **CSS Custom Attributes** - Edge doesn't propagate CSS Variables into pseudo elements, thus icons size might be off.

### Launching Demos

Flexus contains folder `demo` with variety of demo applications which just like any other `.html` has to be served from a webserver.

Note: All demos in folder `demo` and test files in folder `test` have hardcoded absolute paths starting with `/flexus/...` (to make development and testing easier) and the paths will always resolve into `://localhost/flexus/css/flexus-material.css` for example. The whole `flexus` folder therefore has to be copied to the root of the webserver folder, or the absolute paths has to be changed to reflect location of flexus files. So for example
````
<link rel="stylesheet" type="text/css" href="/flexus/css/flexus-material.css">
...
<script src="/flexus/lib/flexus.js"></script>
````
has to be changed to
````
<link rel="stylesheet" type="text/css" href="my_path_to_flexus/css/flexus-material.css">
...
<script src="my_path_to_flexus/lib/flexus.js"></script>
````

### Launching Demos as UWP apps

Folder `flexus` contains Visual Studio project `flexus.jsproj` which requires latest development SDK for Windows 10 Creator's Update.

This project lanches a `flexus/demo/theme-detect.html` file but it can be changed by editing `Start page` field in `package.appxmanifest`.

### Launching Demos as Android Apps

Due to complexity of project creation in Cordova (and dependencies on Android SDK toolchain), this thesis does not contain example Cordova project. Please see [https://cordova.apache.org](https://cordova.apache.org/#getstarted) for more information.

### Launching Demos as PWA

For an example of how to deploy application as a PWA on the web, check out demo in `flexus\demo\pwa-hello-word-original` or  `flexus\demo\pwa-hello-word`

### How to compile Flexus

Flexus comes precompiled and it is not needed to do this step, but if some changes are made to the core of Flexus, run these scripts:

Download dependencies (with the Node.JS package registry npm)
```
npm install
```

Build, compile and transpile libraries, elements and css, except for icons
```
gulp
```
or add `ganymede`, `flexus`, `ui`, `elements`, `core`, `libs`, `libs` to specify which separate part to build.

Icon can be built separately using
```
gulp icons
```

### Thirt party dependencies in this repository

This repository contains third party files that are required by flexus and/or are used for demonstration purposes.

Specifically:

directory `flexus/fonts` contains icons and fonts openly distibuted by Microsoft, Google and https://materialdesignicons.com/

directory `flexus/demo/scripts` contains framework Angular by Google, that is used in some of the demos

I did not develop, nor do I claim ownership of these files.
All rights remain the property of the original developers.

## Developing with Flexus

### Setting up a new application

Just like any HTML document there is some boilerplate code to be copy pasted. In case of Flexus the most important thing to include is the Core Support Library, which, along with custom compoents, has to be at the end of `<body>` element.
```
<script src="/flexus/lib/ganymede.js"></script>
<script src="/flexus/lib/flexus.js"></script>
```
If the application wants to leverage advanced functionality of components like `<flexus-toolbar>`, their respective JS file has to be loaded afterwards.
```
<script src="/flexus/elements/toolbar.js"></script>
```
Then if the automatic design style detection and loading is not desired, concrete CSS files can be specified to load. Either `flexus-material` or `flexus-neon` (as well as icons).
```
<link rel="stylesheet" type="text/css" href="/flexus/css/flexus-material.css">
<link rel="stylesheet" type="text/css" href="/flexus/css/flexus-material-icons.css">
```
The polyfills are not required but it is recommended to include them for a good measure.
```
<script src="/flexus/polyfills/fx-polyfill.js"></script>
<script src="/flexus/polyfills/animate-polyfill.js"></script>
<script src="/flexus/polyfills/custom-elements.min.js"></script>
<script src="/flexus/polyfills/shadydom.min.js"></script>
```

Caveat: Flexus can take care of feature detection and loading required polyfills to fix missing platform features,  but some environments limited by CSP (Chrome OS apps and Windows 10 UWP apps) prevent application from dyamically injecting scripts and styles into the document, resulting in error. Manually importing both CSS stylesheets and all polyfills improves chances of avoiding potential problems.

Note: It is recommended to run a localhost webserver to host files during development.

Then comes the styling part. Theme (`[light]` or `[dark]`) and colors (`[primary="..."]` and `[accent="..."]`) can be specified on `<body>`. Additionally, to prevent Flexus from adjusting UI for non/touch-screens `[touch]` or `[nontouch]` can be added to `<html>` element. Flexus also marks its enty point with attribute `[fx-app]` and can be specified anywhere, but flexus by default assigns it to `<body>` (together with theme if it'S not defined).  

This is a complete boilerplate code that can be copy-pasted to kickstart the development.

```
<!doctype html>
<html>
<head>

	<meta charset="utf-8">

	<!-- load flexus material design --->
	<link rel="stylesheet" type="text/css" href="/flexus/css/flexus-material.css">
	<link rel="stylesheet" type="text/css" href="/flexus/css/flexus-material-icons.css">

	<!-- polyfills neeed by some older platforms --->
	<script src="/flexus/polyfills/fx-polyfill.js"></script>
	<script src="/flexus/polyfills/animate-polyfill.js"></script>
	<script src="/flexus/polyfills/custom-elements.min.js"></script>
	<script src="/flexus/polyfills/shadydom.min.js"></script>

</head>
<body light fx-app primary="blue" accent="yellow">

	<!-- application code goes here --->

	<!-- flexus core --->
	<script src="/flexus/lib/ganymede.js"></script>
	<script src="/flexus/lib/flexus.js"></script>

	<!-- import toolbar custom component --->
	<script src="/flexus/elements/toolbar.js"></script>

</body>
</html>

```

### Mixing

Most attributes are available to used in any combination unless they are in contrast (e.g. `[primary]` and `[accent]` both change background of the element, `[fullwidth]` and `[halfwidth]` change width to different values, etc..).

For Example

* `<flexus-view>` element can be used with:
  * `[primary]` to change color the the view
  * `[panel]` to turn the view into hideable panel. This in turn enables to use `[left]` or `[right]` to set position
  * `[fullwidth]` to make the panel fill up the whole screen when opened. Specifier can also be used to only make the pannel fullwidth on small screens `[fullwidth="small"]`
  * etc ...

* `[icon]` attribute adding icon to the element:
  * Can be mixed with color and size changing attributes like `[tinted]`, `[red]`, `[small]`, `[bold]`.
  * Should ideally be used on `<button>`, `<span>`, `<label>`, elements or with `[fx-item]` attribute on `<div>`.
  * But it can be added to anything (as long as `::before` is not already defined), since `[icon]` creates custom `::before` pseudo element within the element. Adding `[icon]` to `<flexus-view>` is therefore posible, but does not make sense to add inline icon into a block container.

# APIs

## Custom Components
Every custom components emits these additional lifecycle events:
* `created` - Instance of element was created
* `connected` - Element was inserted into DOM
* `ready` - Element was configured and is ready to use
* `disconnected` - Element was removed from DOM

### `<flexus-toolbar>`
Implements `Scrollable`

Toolbar inherits the same behavior as `[fx-item]`. It is a horizontal flexbox with predefined spaces between children. First children is usually a button with `[icon="arrow-back"]` or `[icon="home"]`. Then follows a title of the toolbar, usually a `<h1-6>` or a `<div flex>` where `[flex]` fills out the rest of the space of the toolbar, allowing for additional icons or buttons to display on the right.

Toolbar can be safely used without the JS component file. Even `[multisection]` stuctures are available as long as the attribute `[multisection]` is hard coded. Otherwise, if the JS component file is imported, it can be omitted since the component can recognize its content.

in multisection mode, children of toolbar can use the following attributes:
* `[sticky]` or `[collapse]`
* Flexus tries to automatically guess and assign these properties properly
	* If no element is assigned with either of these attributes, <flexus-toolbar> automatically tries to guess if any element is collapsible (mostly `<img>` elements) and assigns `[collapse]` to it and `[sticky]` to all other elements.
	* If at least one element has `[collapse]`, all other are automatically assigned `[sticky]`.
	* If at least one element has `[sticky]`, all other are automatically assigned `[collapse]`.
	* For fully customized behavior, these attributes can be manually assigned to all elements and Flexus will respect it.

`[seam]` removes shadow (`[elevation]`) in Material design and adds thin border at the bottom of the toolbar (in both Material design and Neon)

Typical color modifying attributes can be used: `[tinted]`, `[primary]`, `[accent]`, `[translucent]`, `[transparent]`, `[opaque]`

#### Available with JS only
* `[waterfall]` sets `[elevation="0"]` (hiding the shadow the element casts) when adjacent content is scolled to top. Material Design Only.

#### Examples:
simple toolbar:
```
<flexus-toolbar>
  <button icon="home"></button>
  <h2>Title</h2>
</flexus-toolbar>
```
multisection toolbar:
```
<flexus-view id="layout-defender">
  <flexus-toolbar>
    <section tinted thin display1>
      Your device is being monitored and protected
    </section>
    <flexus-tabs center small>
      <a href="#" icon="home">Home</a>
      <a href="#" icon="sync">Update</a>
      <a href="#" icon="history">History</a>
      <a href="#" icon="settings">Settings</a>
      <a href="#" icon="help">Help</a>
    </flexus-tabs>
  </flexus-toolbar>
```


### `<flexus-view>`
Implements `Visibility`, `Panel`, `Draggable`, `Scrollable`
Visibility can be controlled by `hide()` and `show()` but it is recommended to only do it for view's with `[panel]` or let Flexus control app layout with `<flexus-scene>`.

View usually only hosts `<flexus-toolbar>` (alternative `<flexus-tabs>` if tabs are not part of the toolbar) and a content container `<main>`:
```
<flexus-view>
  <flexus-toolbar>...</flexus-toolbar>
  <main>Content goes here</main>
</flexus-view>
```

### `<flexus-drawer>`
Implements `Visibility`, `Panel`, `Draggable`
Due to complexity of three collapsible third state the drawer can have in Neon design it is recommended to only use `toggle()` to open and close drawer, instead of `hide()` and `show()`
Drawer automatically closes itself uppon clicking any child elements unless they have `[no-auto-hide]` or `[auto-hide="false"]` attributes.

#### Neon Design Specific Behavior
Drawer has three states depending on screen size
1) small screen size - Drawer is hidden, hamburger buttons in toolbars are shown
2) medium screen size - Drawer is shown as thin strip pinned to left side of the screen. It can be expanded temporarily by clicking hamburger icon, but drawer closes itself again after clicking some child element. `[collapsed]` is automatically set. Hamburger buttons in toolbar are supressed and only single hamburger button inside the drawer is shown.
3) large screen size - Drawer is pinned to the left side of the screen and expanded (`[collapsed]` is automatically removed).

Automatical expansion on large screens can be prevented by assigning attribute `[collapsed]` in template, before the element is created, or by setting property `expandable` to `false` at runtime (initial presence of `[collapsed]` sets default value for `expandable` to be `false`)

`[transparent]` applies transparency on drawer in Neon design and only in collapsed mode (thin pinned column)

#### Material Design Specific Behavior

Drawer is by default hidden at all times and opens up above the content.

### `<flexus-tabs>` and `<flexus-pages>`
Implements `LinearSelectable`

These elements can be to a view to add sub navigation. `<flexus-tabs>` is a list of names and is usually placed `<flexus-toolbar>`. `<flexus-pages>` hosts the contents of tabs defined in `<flexus-pages>` and should contain the same number of children elements, each representing a tab. The pages element replaces `<main>` inside `<flexus-view>`.

Configuring and connecting the two components is not necessary as long as they are together in a a view where these two elements can find each other and interconnect themselves. This can be circumvented by assigning `[no-auto-connect]` or `[auto-connect="false"]` on `<flexus-tabs>` and both of these components can be used separately. Or `[for="..."]` attribute could be assigned to tabs with matching `[id="..."]` on the pages element to specifically link these two components together-

Caveat: `<flexus-pages>` should not be used together with collapsible `<flexus-toolbar>` because every page could have different height and there is no clear scrollable content to anchor the transitions to.

### `<flexus-scene>`

Scene controls layout of two Views on the screen.

Usage:

```
<flexus-scene type="master-detial">
  <flexus-view>...</flexus-view>
  <flexus-view>...</flexus-view>
</flexus-scebe>
```

## Shared Classes
Following classes are part of Flexus Core Support Library and define behavior shared and implemented by Flexus Custom Components 

### `Visibility`
#### Properties
* `hidden` (synchronized with attribute `[hidden]`) hides the element using css rules `display: none` and or `visibility: hidden` depending on other elements features and needs
* `visible` (synchronized with attribute `[visible]`) is opposite of `hidden` and makes the element visible with `display: initial` and or `visibility: visible`

`[hidden]` and `[visible]` are mutually exclusive and setting one changes value of the other automatically.

Note: Other classes inheriting this class usually override css rules to fit their needs element, but semanticity stays the same.

#### Methods
* `hide()` - Hides the element
* `show()` - Shows the element
#### Events
* `hide` - Element changed visibility and is now hidden
* `show` - Element changed visibility and is now visible

### `Panel`
* `[pinned]` element will be by default shown on larger screen in pinned state (within the flow, not flying above the content)
* `[pinnable]` in sets mode to `[pinned]` when the panel is opened
* `[auto-show]`, `[auto-hide]` automatically opens or closes the panel when screen size changes
* `[top]`, `[right]`, `[bottom]`, `[left]` controls positioning of the element using respective css rules in conjuction with `position: absolute`.

`Panel` is always implemented with `Visibility` and shares the same properties, methods and events.

Panel can be remotely controlled via by buttons with a `[for="..."]` attribute matching with `[id="..."]` of the panel, similar to linking HTML's built in `<label>` and `<input>`.

### `Draggable`
* Draggable is always implemented with Panel as it shares the same positioning attributes.
* `[draggable]` is only public API allowing or (temporarily) disabling drag and drop functionality

### `LinearSelectable`

`LinearSelectable` is implemented by container of other elements of which one at a time can be selected. Selecting `[disabled]` elements will cancel the request as well as selecting outside of range (less than 0 or more than ammount of children).

#### Events
* `selected` - Position of selected item
#### Methods
* `prev()` - Selects previous item
* `next()` - Selects next item
* `select(n)` - Selects Nth item
#### Events
* `selected` - New item has been selected


# CSS Attributes

## Layout Attributes

### Flexbox Layout

#### `[layout]`
Turns element into a flexbox which can be either `[horizontal]` or `[vertical]` and aligns content based on given position: `[top]`, `[right]`, `[bottom]`, `[left]`, `[center]`, or a combination like `[left][bottom]`, etc.

#### `[fx-item]`

Basic building block for creating a lists.

Turns element into a flexbox with integrated margin and padding rules that align around indentation line.

Can be used with icons, checkboxes, multiline text, etc.

Few examples of use:
```
<div fx-item icon="cloud">Cloud storage</div>

<div fx-item>
	<i icon="cloud"></i>
	Cloud storage
</div>

<div fx-item>
	<i icon="cloud"></i>
	<span flex>Cloud storage</span>
	<input type="checkbox">
</div>

<div fx-item>
	<i icon="cloud"></i>
	<div two-line>
		<div>1.227.638.0</div>
		<div muted>Version</div>
	</div>
	<div two-line>
		<div>Yesterday</div>
		<div muted>Last save</div>
	</div>
	<input type="checkbox">
</div>
```


### Sizing

#### `[fullwidth]`, `[halfheight]`
Sets `width` or `height` to `100%`.

#### `[fullwidth]`, `[halfheight]`
Sets `width` or `height` to `50%`.

#### `[fullbleed]`, `[bleed]`
`[bleed]` expands element beyond indentation line by setting `-1rem` to `margin-left` and `margin-right`.
`[fullbleed]` is a shortcut for `[fullwidth][bleed]`

#### `[fit]`

### Visibility

#### `[hidden]` and `[visible]`
Attributes [hidden] and [visible] set visibility to hidden and visible respectively as well as overriding default behavior of [hidden], which also sets display to none, where needed.
Both [hidden] and [visible] can be used with a specifier value (small, medium, large, neon, material) to further control the behavior.
Attributes [hidden] and [visible] should not be used with specifiers (small, medium, large, neon, material) on elements that have imported their advanced javascript behavior, because of built in behavior automatically adjusting visibility and display of the element to fit the needs and context.

## Typography

### Presets

#### `[display4]`, `[display3]`, `[display2]`, `[display1]`

Applies presets making the text thin and large.

#### `[headline]`, `[title]`, `[subhead]`

Additional presets for headings.

### `[normal]`

resets font size and style.

### Size

`[small]`, `[normal]`, `[large]`

### Style

`[italic]`, `[underline]`, `[strike]`, `[uppercase]`, `[lowercase]`, `[capitalize]`

### Weight

`[thin]`, `[strong]`, `[bold]`

### Alignment
`[text-left]`, `[text-center]`, `[text-right]` or more specific variants:
`[text-align="left"]`, `[text-align="center"]`, `[text-align="right"]`

## Color

### Themes

#### `[dark]`, `[light]`

Sets light or dark theme for the `<flexus-view>` or `<body>`.

#### `[subtle]`

Changes shade of the theme when used with `[dark]` or `[dark]`.

### Primary and accent colors

Flexus can detect and use and/or update theme color related meta tag and use it as a primary color.
```
<meta name="theme-color" content="#2196F3">
```

### Color palette

```
red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green, light-green, lime, yellow, amber, orange, deep-orange, brown, gray, blue-gray
```

### `[primary]`
Primary color can be set through `[primary="value"]` with a value of color name from Material Design Color Palette. This defines CSS variable that children in scope of this attribute may or may not use.

This color can be then applied using read only attribute `[primary]`.

### `[accent]`
Same as `[primary]`


### `[tinted]`
`[tinted]` is a read only attribute that is an adaptive combination of primary and accent color. This attribute changes foreground in inline elements and background in block elements.

### Transparency

#### `[transparent]`
Makes element transparent.

#### `[translucent]`
Makes element see-through.

#### `[opaque]`
Disabled transparency.

### `[foreground]`

Can be used to fine-tune styles. Applies immediate foreground color of the element.

Uses the same color palette names `[foreground="color"]`

### `[background]`

Much like `[foreground]`, but changes backgorund

### `[red]`, `[blue]`, `[green]`, etc...

Directly applies the color to the element. Like with `[tinted]` foreground or background is changed based on element type.


## Multipurpose Attributes

### `[elevation]`

Changes shadow - position in Z axis.

Values can be used from range `0-5` or in a `dp` unit: `0dp`, `2dp`, `4dp`, `6dp`, `8dp`, `10dp`

Based on and only available in Material Design.

### `[avatar]`
Avatar is multipurpose attribute that can be used with various elements such as `input[type="checkbox"], img, i[icon], div`, etc and was built specifically (but not exclusively) for list items (`[fx-item]`).

Example of simple item with avatar and name

```
<div fx-item>
	<img src="avatars/zenyatta.jpg" avatar>
	Zenyatta
</div>
```

Not that it wouldn't be possible to support children within avatar but various Chrome rendering glitches, performance hickups and extensive codebase lead to withdrawing support for this.