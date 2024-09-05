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
  loadLocalFiles: boolean = true;
  filesLoaded: boolean = false;
  fileRibo: File | null = null;
  fileRNA: File | null = null;

  fileMatching: boolean = true;
  fileValid: boolean = true;

  constructor(public store: Store) {

  }

  select() {
      this.store.dispatch(datasetSourceActions.select({toBeSelected: this.source}));
  }

  onFileSelected(event: any) {
    if (this.isRiboSeq()) {
      this.showPopup = true;
      this.loadLocalFiles = false;
    } else {
      const file: File = event.target.files[0];
      if (file) {
        this.store.dispatch(datasetActions.upload({id: this.datasetId, file, typeId: this.source.id}))
      }
    }
  }

  isRiboSeq(): boolean {
    return this.source.name === 'Ribo-seq';
  }

  // logic for ribo seq data
  closePopUp(){
    this.showPopup = false;
    this.filesLoaded = false;
    this.fileRibo = null;
    this.fileRNA = null;
  }

  async uploadRNAFile(event: any){
    this.fileRNA = event.target.files[0];

    if(this.fileRNA) {
      this.fileValid = await this.checkValidFile(this.fileRNA)
    }

    if(this.fileRibo && this.fileRNA){
      this.filesLoaded = true;
      this.fileMatching = await this.checkFirstLinesMatch(this.fileRNA, this.fileRibo);
    }
  }
  async uploadRiboFile(event: any){
    this.fileRibo = event.target.files[0];
    if(this.fileRibo) {
      this.fileValid = await this.checkValidFile(this.fileRibo)
    }
    console.log(this.fileValid)
    if(!this.fileValid){
      console.log("Not all integers")
    }
    if(this.fileRibo && this.fileRNA){
      this.filesLoaded = true;
      this.fileMatching = await this.checkFirstLinesMatch(this.fileRNA, this.fileRibo);
    }
  }

  async uploadRiboData(){
    if (this.fileRibo && this.fileRNA) {

      const firstLineMatch = await this.checkFirstLinesMatch(this.fileRNA,this.fileRibo);
      this.fileMatching = firstLineMatch;
      if (firstLineMatch) {

        const file1Content = await this.readFile(this.fileRNA); // read rna file
        const file2Content = await this.readFile(this.fileRibo); // read ribo data


        // merging files
        Promise.all([file1Content, file2Content])
          .then((contents) => {
            const mergedData = this.mergeFiles(contents[0], contents[1]);
            this.store.dispatch(datasetActions.upload({file: mergedData, id: this.datasetId, typeId: this.source.id}))
          })
          .catch((error) => {
          });
        this.closePopUp();
      }
      else {
        this.fileMatching = false;
      }
    }
  }

  async checkValidFile(file: File): Promise<boolean> {  // only integers are allowed
    console.log("check valid")
    console.log(file)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function(event) {
        const text = event.target?.result as string;
        if (!text) {
          return resolve(false);
        }

        // Split the text into lines
        const lines = text.trim().split('\n');

        // Iterate through each line starting from the second line (skip the header)
        for (let i = 1; i < lines.length; i++) {
          const columns = lines[i].split('\t');

          // Iterate through each column starting from the second column (skip the identifier)
          for (let j = 1; j < columns.length; j++) {
            const value = columns[j].trim();

            // Check if the value is not an integer
            if (!Number.isInteger(Number(value))) {
              return resolve(false);
            }
          }
        }
        // All values are integers
        resolve(true);
      };
      reader.onerror = function() {
        reject(new Error("Failed to read the file"));
      };
      reader.readAsText(file);
    });
  }

  async checkFirstLinesMatch(fileRNA: File, fileRibo: File): Promise<boolean> {
    try {
      const [file1Content, file2Content] = await Promise.all([
        this.readFile(fileRNA),
        this.readFile(fileRibo)
      ]);

      const file1FirstLine = file1Content.split('\n')[0].trim();
      const file2FirstLine = file2Content.split('\n')[0].trim();

      return file1FirstLine === file2FirstLine;
    } catch (error) {
      return false;
    }
  }


  // merge files after annotation
  mergeFiles(file1Content: string, file2Content: string): File {
    const file1Rows = file1Content.trim().split('\n');
    const file2Rows = file2Content.trim().split('\n');

    // Assuming the first row is headers
    const headers1 = file1Rows[0].split('\t');
    let headers2 = file2Rows[0].split('\t');
    headers2 = headers2.slice(1);  // remove first column

    // Merging headers
    const mergedHeaders = headers1.concat(headers2).join('\t');

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
    const mergedFile = new File([blob], 'mergedFile.tsv', { type: 'text/tab-separated-values' });
    return mergedFile;
  }

  readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }
}
