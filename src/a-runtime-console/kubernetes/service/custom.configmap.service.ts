import {Inject, Injectable} from '@angular/core';
import {Restangular} from 'ng2-restangular';
import {Observable} from 'rxjs';
import {KUBERNETES_RESTANGULAR} from './kubernetes.restangular';
import {ConfigMap} from '../model/configmap.model';
import {NamespacedResourceService} from './namespaced.resource.service';
import {NamespaceScope} from './namespace.scope';

export const FunktionKindAnnotation = 'funktion.fabric8.io/kind';

// @Injectable()
// export abstract class CustomConfigMapService<T extends ConfigMap, L extends Array<T>> extends NamespacedResourceService<T, L> {
//   constructor(@Inject(KUBERNETES_RESTANGULAR) kubernetesRestangular: Restangular, namespaceScope: NamespaceScope, public funktionKind: string = '') {
//     super(kubernetesRestangular, namespaceScope, '/configmaps');
//   }
//
//   list(): Observable<L> {
//     if (this.funktionKind) {
//       return this.restangularService.getList({
//         labelSelector: FunktionKindAnnotation + '=' + this.funktionKind,
//       });
//     } else {
//       return super.list();
//     }
//   }
// }
