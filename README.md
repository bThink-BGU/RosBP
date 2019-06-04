# SampleBPjsProject

A sample maven project using BPjs. Clone or fork this project to easily start your own prject using BPjs. This project has two files:

* `src/main/resources/HelloBPjsWorld.js` BPjs "hello world" program.
* `src/main/java/il/ac/bgu/cs/bp/samplebpjsproject/HelloWorld.java` Simple "main" class for running `HelloBPjsWorld.js` and emitting its events to stdout.


To make the project runnable from the commandline, add this to the `<properties>` node of the `pom.xml` file:

    <exec.mainClass>package.name.goes.here.and.then.ClassName</exec.mainClass>

Then run the application by typing:

    mvn exec:java

## Please keep these:
* This project uses [BPjs](https://github.com/bThink-BGU/BPjs).
* BPjs uses the Mozilla Rhino Javascript engine. See [here](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino) for project page and source code.

