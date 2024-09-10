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

  async uploadRiboData(){
    console.log("Upload funciton")

    if (this.fileRibo && this.fileRNA) {
      let fileRNA_ = this.fileRNA
      let fileRibo_ = this.fileRibo
      console.log("Upload")
      this.store.dispatch(datasetActions.uploadRibo({id: this.datasetId, fileRibo: fileRibo_, fileRNA: fileRNA_,typeId: this.source.id}))
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
    if (this.fileRNA) {
      const fileNameElement = document.getElementById('rna-file-name');
      if (fileNameElement) {
        fileNameElement.textContent = this.fileRNA.name;  // Display the selected file name
      }
    }

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
      const fileNameElement = document.getElementById('ribo-file-name');
      if (fileNameElement) {
        fileNameElement.textContent = this.fileRibo.name;  // Display the selected file name
      }
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


  async checkValidFile(file: File): Promise<boolean> {
    console.log("check valid")
    console.log(file)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function(event) {
        const text = event.target?.result as string;
        if (!text) {
          return resolve(false);
        }
        const lines = text.trim().split('\n');

        for (let i = 1; i < lines.length; i++) {
          const columns = lines[i].split('\t');
          for (let j = 1; j < columns.length; j++) {
            const value = columns[j].trim();
            if (!Number.isInteger(Number(value))) {
              return resolve(false);
            }
          }
        }
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

  readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }
}
