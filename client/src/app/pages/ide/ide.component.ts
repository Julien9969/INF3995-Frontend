/* eslint-disable @typescript-eslint/no-explicit-any */
import { NestedTreeControl } from '@angular/cdk/tree';
import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTreeModule, MatTreeNestedDataSource} from "@angular/material/tree";
import { CommonModule } from '@angular/common';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FormsModule } from '@angular/forms';
import { FilesService } from '@app/services/files/files.service';
import { FilesTree, FilesTreeNode } from '@app/interfaces/files-tree';
import { File } from '@app/interfaces/file';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-ide',
  standalone: true,
  imports: [
    MatIconButton,
    MatButton,
    MatIcon,
    MatTreeModule,
    CommonModule,
    FormsModule,
    CodemirrorModule,
  ],
  templateUrl: './ide.component.html',
  styleUrl: './ide.component.scss'
})
export class IdeComponent implements OnInit {
    title = 'ide';
    treeControl = new NestedTreeControl<FilesTreeNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<FilesTreeNode>();
    filesTree: FilesTree = [];
    hoveredName: string | null = null;
    codeEditorContent: string = ""; 
    currentFile: FilesTreeNode | null = null;
    
    codeMirrorOptions: any = {
        mode: "text/javascript",
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        lineWrapping: false,
        extraKeys: { "Ctrl-Space": "autocomplete" },
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        autoCloseBrackets: true,
        matchBrackets: true,
        lint: true
    };


  constructor(private filesService: FilesService) {}

    ngOnInit() {
        try {
            this.filesService.getFileTree().subscribe({
                next: (response: HttpResponse<string>) => { 
                    console.log("Response code:", response.status);
                    this.filesTree = JSON.parse(response.body as string) as FilesTree; 
                    this.dataSource.data = this.filesTree;
                }, 
                error: (error) => {
                    console.error("Error:", error);
                    console.log("TODO - show error message");
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    saveFile() {
        console.log(this.codeEditorContent);
        this.filesService.saveFile("test.js", this.codeEditorContent).subscribe({
            next: (response: HttpResponse<string>) => { 
                console.log("Response code:", response.status);
                console.log("Response body:", response.body);
            },
            error: (error) => {
                console.error("Error:", error);
                console.log("TODO - show error message");
            }
        });
        console.log("save");
    }

    loadFile(file: FilesTreeNode) {
        console.log("Loading file:", file);
        this.currentFile = file;
        this.filesService.getFile(file).subscribe({
            next: (response: HttpResponse<object>) => { 
                console.log("Response:", response);
                this.codeEditorContent = (response.body as File).content;
            },
            error: (error) => {
                console.error("Error:", error);
                console.log("TODO - show error message");
            }
        });
    }
    
    hasChild = (_: number, node: FilesTreeNode) => !!node.children && node.children.length > 0;
}

