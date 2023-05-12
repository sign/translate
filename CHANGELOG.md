# Changelog

This file is used to list changes made over time to `sign/translate`.

## Unreleased

### 0.0.2

#### Features

- **core**: split app into modules to decrease chunk sizes
- **github**: add github star button
- **settings**: moved settings to a tabs page instead of a dialog

#### Style

- **core**: migrated app from `angular/material` to `ionic`
- **ios/safari**: add iOS style for iOS devices / Safari
- **translation**: integrate a new interface for mobile devices

#### Fixes

- **avatar**: fix avatar rotation names
- **tests**: fix flaky tests, caused by race conditions
- **sharing**: removed sharing from the desktop web when unsupported

## Released

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
