import { Component, Input } from '@angular/core';
import { ReplicaSet } from '../../../model/replicaset.model';
import { YamlEditor } from '../../../view/yaml.editor';

@Component({
  selector: 'fabric8-replicaset-edit',
  templateUrl: './edit.replicaset.component.html'
})
export class ReplicaSetEditComponent {

  @Input() replicaset: ReplicaSet;

  @Input() yamlEditor: YamlEditor;

}
