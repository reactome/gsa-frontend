
# Overview
New implementation of the already existing Reactome GSA frontend. The backend is hosted on gsa.reactome.org.


# Project details
The new frontend works similar to the old implementation: https://reactome.org/userguide/analysis/gsa

 The design was completely reworked. Stylistically (e.g. color scheme) the design was based on the design of the Pathway Browser to simplify a later integration. The already existing version of the GSA frontend was extended by the following features:

## Rework of the annotation of datasets
The annotation of the datasets has been completely reworked and redesigned. The goal is to simplify the user's work with a spreadsheet-like table.
The user is now able to upload its datasets annotations  in CSV or TSV format. Furthermore, values can be copied from Excel or Google sheets and pasted into the table. It is also possible to copy ranges from the website table into any spreadsheet software. This new range editing also supports its deletion . Furthermore, to help the accessibility,  it is also possible to navigate through the table with the keyboard.

## Add dataset specific parameters to override method defaults
It is possible for the user to overwrite the analysis parameters selected in the first step for individual datasets. Once a data set has been selected it is possible to click a button in the corresponding dataset header to overwrite the respective parameters.

## Waiting bar showing progress
In the former implementation, only a spinning circle was displayed when waiting for the analysis results. This circle has now been replaced by two meaningful loading bars, which shows the loading progress so far as a percentage. The two separate loading bars were introduced, one for analysis and  the other for reports. 

## Responsiveness
The new implementation of the ReactomeGSA works on different screen sizes. It is now possible to carry out an analysis on any device, from smartphones with a screen width of 600px up to large screens with a width of 1900px or above. The design adapts flexibly to the respective screen width. Regarding this specific topic, the dataset annotation has been completely redesigned, since displaying the complete table on small screens would be very confusing.

## Specific error messages
Specific error messages are displayed when uploading a data set and when performing an analysis. Previously, only a generic error message was shown, which revealed nothing about the specific problem.
