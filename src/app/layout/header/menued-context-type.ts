import { ContextType } from 'ngx-fabric8-wit';

import { MenuItem } from 'osio-ngx-framework';

export class MenuedContextType implements ContextType {
  name: string;
  icon: string;
  menus: MenuItem[];
}
