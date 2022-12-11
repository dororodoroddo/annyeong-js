/**
 * wip
 */
class AnnyeongProcessManager {
  private stateSyncProcessQueue = new Set();

  private getterSyncProcessQueue = new Set();
  private renderProcessQueue = new Set();
  constructor() {
    //
  }

  public pushGetterSyncQueue(key: string, targetGetter: ()=>any) {
    this.getterSyncProcessQueue.add(targetGetter);
  }
  public pushRenderQueue(key: string, targetRender: ()=>void) {
    this.renderProcessQueue.add(targetRender);
  }

  public getKey(key?: string) {
    if (key) {
      //  
    }

    return '';
  }
}

const annyeongProcessManager = new AnnyeongProcessManager();
export default annyeongProcessManager;