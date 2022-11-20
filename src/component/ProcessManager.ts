/**
 * wip
 */
export default class AnnyeongProcessManager {
  // 스테이트는 큐 없이 즉시 호춣하면 되므로 삭제 예정
  private stateSyncProcessQueue = new Set();

  private getterSyncProcessQueue = new Set();
  private renderProcessQueue = new Set();
  constructor() {
    //
  }

  public pushGetterSyncQueue(targetGetter: ()=>any) {
    this.getterSyncProcessQueue.add(targetGetter);
  }
  public pushRenderQueue(targetRender: ()=>void) {
    this.renderProcessQueue.add(targetRender);
  }
}