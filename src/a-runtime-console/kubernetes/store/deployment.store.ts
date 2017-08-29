import {Injectable} from '@angular/core';
import {Deployment, Deployments} from '../model/deployment.model';
import {DeploymentService} from '../service/deployment.service';
import {NamespacedResourceStore} from './namespacedresource.store';
import {NamespaceScope} from '../service/namespace.scope';

@Injectable()
export class DeploymentStore extends NamespacedResourceStore<Deployment, Deployments, DeploymentService> {
  constructor(deploymentService: DeploymentService, namespaceScope: NamespaceScope) {
    super(deploymentService, [], <Deployment>{}, namespaceScope, Deployment);
  }

  protected get kind() {
    return 'Deployment';
  }
}
