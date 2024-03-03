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

  
  const TREE_DATA: FilesTree =  [{
    name: "INF3995",
    children: [
        {
            name: "9781788478953-MASTERING_ROS_FOR_ROBOTICS_PROGRAMMING_SECOND_EDITION.pdf",
            children: null
        },
        {
            name: "appel.pdf",
            children: null
        },
        {
            name: "Contratdéquipe_cible.doc",
            children: null
        },
        {
            name: "cours",
            children: [
                {
                    name: "Contrats-INFO-LOG.ppsx",
                    children: null
                },
                {
                    name: "DirectionLeadershipINFO-LOG.pdf",
                    children: null
                },
                {
                    name: "DirectionLeadershipINFO-LOG.ppsx",
                    children: null
                },
                {
                    name: "exos",
                    children: [
                        {
                            name: "DirectionProjetLeadership.pdf",
                            children: null
                        }
                    ]
                },
                {
                    name: "SuiviAvancementINFO-LOG.ppsx",
                    children: null
                },
                {
                    name: "vidéo",
                    children: []
                }
            ]
        },
        {
            name: "requis.pdf",
            children: null
        }
    ]
}];
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

    query = `@Component({
        selector: 'app-root',
        standalone: true,
        imports: [RouterOutlet, MatToolbar, RouterLink, MatButton, MatIcon, MatIconButton],
        templateUrl: './app.component.html',
        styleUrl: './app.component.scss'
      })
      export class AppComponent {
        status: string = 'offline';
      
        constructor(private router: Router) {
        }
      
        goBackHome() {
          this.router.navigate(['/'])
        }
      }
      `;

  constructor(private filesService: FilesService) {
    this.dataSource.data = TREE_DATA;

  }

    ngOnInit() {
        console.log(this.query);
        try {
            this.filesService.getFileTree().subscribe((response: FilesTree) => { this.filesTree = response; console.log(response); });
            console.log(this.filesTree);
        } catch (error) {
            console.error(error);
        }
    }

    setEditorContent(event: any) {
        console.log("event", event);
    }
    
    hasChild = (_: number, node: FilesTreeNode) => !!node.children && node.children.length > 0;
}

