/* eslint-disable @typescript-eslint/no-explicit-any */
import { NestedTreeControl } from '@angular/cdk/tree';
import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTreeModule, MatTreeNestedDataSource} from "@angular/material/tree";
import { CommonModule } from '@angular/common';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FormsModule } from '@angular/forms';


/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
    name: string;
    children?: FoodNode[];
}
  
  const TREE_DATA: FoodNode[] = [
    {
      name: 'Fruit',
      children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
    },
    {
      name: 'Vegetables',
      children: [
        {
          name: 'Green',
          children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
        },
        {
          name: 'Orange',
          children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
        },
      ],
    },
    {
        name: 'Vegetables',
        children: [
          {
            name: 'Green',
            children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
          },
          {
            name: 'Orange',
            children: [{name: 'Pumpkins'}, {name: 'Carrots', children: [{name: 'Pumpkins'}, {name: 'Carrots'}],}],
          },
        ],
      },
  ];

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
    treeControl = new NestedTreeControl<FoodNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<FoodNode>();

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

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

    ngOnInit() {
        console.log(this.query);
    }

    setEditorContent(event: any) {
        console.log("event", event);
    }
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}

