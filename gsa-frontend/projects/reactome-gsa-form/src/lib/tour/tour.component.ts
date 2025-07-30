import {Component} from '@angular/core';
import {TourService} from "ngx-ui-tour-md-menu";
import {IMdStepOption} from "ngx-ui-tour-md-menu/lib/step-option.interface";
import {HeightService} from "../services/height.service";
import {TourUtilsService} from "../services/tour-utils.service";

@Component({
    selector: 'gsa-tour',
    templateUrl: './tour.component.html',
    styleUrls: ['./tour.component.scss'],
    standalone: false
})
export class TourComponent {

  constructor(public tourService: TourService, public tour: TourUtilsService, public height: HeightService) {
    console.log('init tour')
    this.tourService.initialize([
      {
        anchorId: 'Camera',
        icon: 'ads_click',
        title: 'Select method',
        content: "Click \"Camera\" panel to select the Camera analysis method.<br>" +
          "Camera is a good choice for a first analysis: it's the fastest to perform",
        route: 'form',
        nextOnAnchorClick: true,
        isAsync: true,
        scrollContainer: '#scroll-container-method',
        centerAnchorOnScroll: true,
      }, {
        anchorId: 'method.done',
        icon: 'ads_click',
        title: 'Continue',
        content: "Click \"Continue\" button to go to the next step",
        nextOnAnchorClick: true,
        scrollContainer: '#scroll-container-method',
        centerAnchorOnScroll: false,
        placement: {yPosition: 'above', xPosition: 'before'}
      }, {
        anchorId: 'source.local',
        title: 'Local data',
        content: 'You can upload your own data in the following section',
        isAsync: true,
        scrollContainer: '#scroll-container-dataset',
      }, {
        anchorId: 'source.public',
        title: 'Public data',
        content: 'You can use already published dataset in the following section',
        scrollContainer: '#scroll-container-dataset',
      }, {
        anchorId: 'search',
        title: 'Search',
        content: 'This option allow you to search across available datasets in ' +
          '<a href="https://www.ebi.ac.uk/gxa/home">Expression Atlas</a> ' +
          'and <a href="http://www.ilincs.org/apps/grein/">GREIN</a>',
        scrollContainer: '#scroll-container-dataset',
      }, {
        anchorId: 'source.example',
        title: 'Example data',
        content: 'The simplest way to perform quickly an analysis: use one of the bellow examples',
        scrollContainer: '#scroll-container-dataset',
      }, {
        anchorId: 'source.example.1',
        icon: 'ads_click',
        title: 'First example',
        content: 'Click on "Melanoma RNA-seq example" to analyse this dataset',
        nextOnAnchorClick: true,
        scrollContainer: '#scroll-container-dataset',
      }, {
        anchorId: 'annotate.name',
        title: 'Name your dataset',
        content: 'You can rename your dataset here',
        delayBeforeStepShow: 1750,
        isAsync: true,
        scrollContainer: '#scroll-container-dataset',
      }, {
        anchorId: 'annotate.table',
        title: 'Dataset annotation',
        content: 'In this step, you need to provide meta-data on the different samples in the dataset, like condition, gender, etc.<br> ' +
          'Because you are using an exemple, the data is already annotated for you.',
        scrollContainer: '#scroll-container-dataset',
      }, {
        anchorId: 'annotate.done',
        icon: 'ads_click',
        title: 'Continue',
        content: 'Click on the "⌄" button once you finished annotating the dataset',
        nextOnAnchorClick: true,
        scrollContainer: '#scroll-container-dataset',
        placement: {yPosition: 'above', xPosition: 'before'}
      }, {
        anchorId: 'stat.factor',
        title: 'Comparison factor',
        content: 'GSA analysis requires you to choose which factor, from the metadata, you want to compare between samples',
        delayBeforeStepShow: 500,
        isAsync: true,
        scrollContainer: '#scroll-container-dataset',
      }, {
        anchorId: 'stat.groups',
        title: 'Groups',
        content: 'Among the different values you provided for the comparison factor, <br> ' +
          'you need to choose which group of samples will be compared to which other group.',
        scrollContainer: '#scroll-container-dataset',
      }, {
        anchorId: 'stat.cofactor',
        title: 'Cofactor',
        content: 'The other factors you provided in the annotation step can have an impact on the result.<br>' +
          'If you want to remove the influence of those factor on the comparison, select them.',
        isOptional: true,
        isAsync: false,
        scrollContainer: '#scroll-container-dataset',
      }, {
        anchorId: 'dataset.save',
        icon: 'ads_click',
        title: 'Save dataset',
        content: 'Click on the "Save" button.<br>' +
          'All datatasets must be saved to continue further the analysis',
        nextOnAnchorClick: true,
        scrollContainer: '#scroll-container-dataset',
      }, {
        anchorId: 'dataset.add',
        title: 'Add more datasets',
        content: 'You can analyse several datasets in one go by adding new one and saving them',
        delayBeforeStepShow: 500,
        isAsync: true,
        scrollContainer: '#scroll-container-dataset',
      }, {
        anchorId: 'dataset.done',
        icon: 'ads_click',
        title: 'Continue',
        content: 'Click on this button once the selection of datasets is finished',
        nextOnAnchorClick: true,
        scrollContainer: '#scroll-container-dataset',
        placement: {yPosition: 'above', xPosition: 'before'}
      }, {
        anchorId: 'options',
        title: 'Options',
        content: "You can choose what type of output you want from your analysis using these options, <br>" +
          "and be warned by mail when the analysis is over by providing it bellow",
        delayBeforeStepShow: 500,
        isAsync: true,
        scrollContainer: '#scroll-container-options',
      }, {
        anchorId: 'options.done',
        icon: 'ads_click',
        title: 'Continue',
        content: 'Click on the "Continue" button once you selected your desired outputs',
        nextOnAnchorClick: true,
        scrollContainer: '#scroll-container-options',
        placement: {yPosition: 'above', xPosition: 'before'}
      }, {
        anchorId: 'results',
        title: 'Waiting for results',
        content: 'The only thing left to do is wait for your results to be ready!',
        delayBeforeStepShow: 500,
        isAsync: true,
        scrollContainer: '#scroll-container-results',
      }
    ] as IMdStepOption[])
  }
}
