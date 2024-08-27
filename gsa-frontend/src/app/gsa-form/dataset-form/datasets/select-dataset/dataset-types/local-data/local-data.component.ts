import {Component, Input} from '@angular/core';
import {PDatasetSource} from "../../../../../state/dataset-source/dataset-source.state";
import {datasetSourceActions} from "../../../../../state/dataset-source/dataset-source.action";
import {Store} from "@ngrx/store";
import {datasetActions} from "../../../../../state/dataset/dataset.actions";
import {getMatIconFailedToSanitizeUrlError} from "@angular/material/icon";

@Component({
  selector: 'gsa-local-data',                     // typescript class
  templateUrl: './local-data.component.html',     // html template
  styleUrls: ['./local-data.component.scss']     // styles
})
export class LocalDataComponent {
  @Input() source: PDatasetSource;
  @Input() datasetId: number;

  showPopup: boolean = false;
  filesLoaded: boolean = false;

  fileRibo: File | null = null;
  fileRNA: File | null = null;

  constructor(public store: Store) {
  }

  select() {
      console.log("normal select")
      this.store.dispatch(datasetSourceActions.select({toBeSelected: this.source}));
  }

  uploadRNAFile(event: any){
    this.fileRNA = event.target.files[0];
    console.log("RNA File")
    console.log(this.fileRNA);
    if(this.fileRibo && this.fileRNA){
      this.filesLoaded = true;
    }
  }


  uploadRiboFile(event: any){
    this.fileRibo = event.target.files[0];
    console.log("Ribo File")
    if(this.fileRibo && this.fileRNA){
      this.filesLoaded = true;
    }
  }

  uploadRiboData(){    // called from html to upload data
    console.log("Ribo data")
    // here the data is uploaded
    console.log(this.fileRibo);
    if (this.fileRibo && this.fileRNA) {
      console.log("Both files uploaded")
      const file1Content = this.readFile(this.fileRNA); // read rna file
      const file2Content = this.readFile(this.fileRibo); // read ribo data

      Promise.all([file1Content, file2Content])
        .then((contents) => {
          const mergedData = this.mergeFiles(contents[0], contents[1]);
          console.log('Merged Data:', mergedData);
          this.store.dispatch(datasetActions.upload({file: mergedData, id: this.datasetId, typeId: this.source.id}))
          // Further processing with mergedData
        })
        .catch((error) => {
          console.error('Error reading files:', error);
        });
    }
    this.closePopUp();
  }

  readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  mergeFiles(file1Content: string, file2Content: string): File {    /// merge files for Ribo seq data
    const file1Rows = file1Content.trim().split('\n');
    const file2Rows = file2Content.trim().split('\n');

    // Assuming the first row is headers
    const headers1 = file1Rows[0].split('\t');
    let headers2 = file2Rows[0].split('\t');
    headers2 = headers2.slice(1);  // remove first column

    const updatedHeaders1 = headers1.map(header => header + '_RNA');
    const updatedHeaders2 = headers2.map(header => header + '_RIBO');

    // Merging headers
    const mergedHeaders = updatedHeaders1.concat(updatedHeaders2).join('\t');

    // Merging data rows
    const mergedRows = [mergedHeaders];
    const maxRows = Math.max(file1Rows.length, file2Rows.length);

    for (let i = 1; i < maxRows; i++) {
      const row1 = file1Rows[i] ? file1Rows[i].split('\t') : [];
      const row2 = file2Rows[i] ? file2Rows[i].split('\t') : [];
      const mergedRow = row1.concat(row2).join('\t');
      mergedRows.push(mergedRow);
    }
    const mergedDataString = mergedRows.join('\n');
    const blob = new Blob([mergedDataString], { type: 'text/tab-separated-values' });

    // Create a File from the Blob
    const mergedFile = new File([blob], 'mergedFile.tsv', { type: 'text/tab-separated-values' });
    console.log("File Header: ", mergedHeaders);
    console.log("Merged File: ", mergedFile);
    return mergedFile;
  }

  closePopUp(){
    this.showPopup = false;
    this.filesLoaded = false;
    this.fileRibo = null;
    this.fileRNA = null;
  }

  onFileSelected(event: any) {
    if (!this.showPopup) {
      const file: File = event.target.files[0];
      if (file) {
        this.store.dispatch(datasetActions.upload({id: this.datasetId, file, typeId: this.source.id}))
      }
    }
  }


}
