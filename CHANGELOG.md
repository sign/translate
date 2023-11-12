# Changelog

This file is used to list important changes made over time to `sign/translate`.

## Unreleased

### 0.0.3

#### Documentation

- **wiki**: redo wiki to be more transparent about the project's progress

#### Features

- **api**: add text-normalization API with appCheck support
- **spoken-to-signed**: add language detection suggestion "Translate from: \_\_\_"
- **spoken-to-signed**: add text edit suggestions "Did you mean: \_\_\_"
- **core**: upgraded to angular 17, and all relevant dependencies
- **skeleton-viewer**: add VideoEncoder video rendering for consistent and controllable rendering

#### Style

- **signed-to-spoken**: integrate a new interface for mobile devices

#### Fixes

- **normalization**: cancel normalization requests when user changes text
- **skeleton-viewer**: video recordings don't lag when user hides the page
- **mobile**: lock screen to portrait orientation

## Released

### 0.0.2 (2023/10/20)

#### Documentation

- **readme**: redo README to be more developer friendly

#### Features

- **core**: split app into modules to decrease chunk sizes
- **github**: add github star button
- **settings**: moved settings to a tabs page instead of a dialog
- **human**: mux human videos instead of screen recording
- **build**: move CI to using bun, and speed up builds
- **translation**: change signed languages from countries to language codes

#### Style

- **core**: migrated app from `angular/material` to `ionic`
- **ios/safari**: add iOS style for iOS devices / Safari
- **translation**: integrate a new interface for mobile devices
- **human**: position human in center of screen

#### Fixes

- **avatar**: fix avatar rotation names
- **tests**: fix flaky tests, caused by race conditions
- **sharing**: removed sharing from the desktop web when unsupported
- **settings**: navigation back button text matches the main page title
- **signed-to-spoken**: fix upload videos component
- **avatars**: add missing tooltips

### 0.0.1 (2023/03/13)

#### Style

- **settings**: dialog is fully black on mobile. No rounded corners

#### Features

- **language-selector**: group languages under initial letter
- **material-icons**: add automatic update script

#### Fixes

- **install**: fix `npm install` on Windows using PowerShell
- **sitemap**: utilise page alternates for different page languages

### 0.0.0 (2023/02/13)

Changes before these dates were not tracked in the changelog
