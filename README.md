Developer tool that provides visual information about Meteor templates
----

Based on the work of Sacha Grief, as first seen [on crater.io](http://crater.io/posts/CrigwRm5dfcDE625e)

Quick start
----

```
meteor add babrahams:temple
```

Use [control] + [T] to activate *Temple*.

Note:

1. *Temple* will plug itself into the UI of `msavin:mongol` if that package is added to your project.
2. This is a `{debugOnly: true}` package, so it won't be compiled into production builds.

Usage
----

When *Temple* is activated, templates are outlined with red borders.

When hovered over, the name of the template shows, along with a number that shows which rendered instance of the template this represents (since the last hard browser refresh).

Click on any element to see the data context of the element as pretty JSON.