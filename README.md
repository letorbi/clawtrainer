# Claw Trainer

Finger strength is important for hard climbing. Hangboards (fingerboards) are the most effective way to improve finger strength. This app supports you in your training on *Beastmaker 1000*, *Beastmaker 2000* and *Smartrock Griptonite* hangboards. Other hangboards will be supported eventually.

Claw Trainer is mainly an Android app, but other platforms supported by [Apache Cordova](https://cordova.apache.org/) might work as well. It is licensed as open-source under the GPL version 3.

## Features

* Spoken instructions in English language
* Visual instructions with photos
* Integrated training programs
* Editor for creating custom training programs
* Support for several hangboards
* No network connection required
* It is entirely free!

## Building

Claw Trainer uses Apache Cordova to run as a native app, so please make sure that Cordova and its dependencies (Java 8, Gradle) are installed properly. Android Studio should be installed as well.

Once all build-tools are installed, only the following commands are required to build the Android app:

```
$ cordova platform add android
$ cordova build android
```

This will create an Android Studio project in the subfolder *platforms/android*. The command `cordova run android --emulator` can be used, to start the app directly in an emulated Android device.

Even though Cordova also supports iOS or other plattforms, Claw Trainer is currently only tested on Android. Feel free to try other platforms, but your mileage may vary.

## Training methods

### Hangboard repeaters

Training on hangboards means executing sets of short hangs with short rests in between. A set may consist of six hangs of seven seconds each, for example, seperated by rests of three seconds each. All six repeats are done on the same holds with the same grip type (finger position). Such a set is called an *exercise* is Claw Trainer. After the exercise, you take a rest for some minutes. Then you move on to the next exercise on other holds. A complete workout of several exercises is called a *program* in Claw Trainer.

The repeater method trains both your strength endurance and your maximum strength.

### Maximum hangs

An alternative method is to hang for longer times of ten or twelve seconds. Holds and grip type are chosen such that each hang requires maximum effort. The rests between the hangs are much longer, up to three or five minutes, to allow for a full recovery. A set again comprises three or five repeats on the same hold.

The maximum hangs method mostly improves maximum strength.

### Smart beastmaking

Claw Trainer is useful for both methods and comes with a number of built-in programs for both methods. Claw Trainer guides you through these programs with detailed instructions, using spoken language, pictures and descriptive texts.

An integrated editor allows to modify these programs and to create new custom programs according to your own preferences. There is an option for exporting and importing custom programs as JSON files. These files can be edited with a normal text editor and can easily be shared with other people.

## Contributions

Claw Trainer is based on Nappy Fingers, which was developed by Daniel Schroeer since 2018 and released under the GNU GPL v3 in 2021. Unfortunately he decided to retire as lead developer in 2023 and asked that future releases were made under a new name.

Feedback and contributions are welcome. Please create a pull request, if you have updates to the code. If you send us your custom programs, they will be considered for inclusion as built-ins.

----

Copyright 2023 Torben Haase \<[https://letorbi.com](https://letorbi.com)> & contributors
