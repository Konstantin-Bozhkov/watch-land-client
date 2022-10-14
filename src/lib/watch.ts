
export class Watch{
    callbacks:any[] = [];
    callbackAll:any;
    resolved:boolean = false;
    resolvedAll:boolean = false;
    data:any[] = []
    all:any[] = []

    resolve(data:any[]) {
        this.data = data
        this.all = [...this.all, ...data]
        this.resolved = true;
        // fire all callbacks
        this.callbacks.forEach(function(callback) {
            callback(data);
        });
    }
    resolveAll(){
        this.resolvedAll = true;
        if(this.callbackAll) this.callbackAll(this.all);
    }
    ready(callbackAll:any){
        if (this.resolvedAll) {
            callbackAll()
        } else {
            // otherwise, queue up the callback for later
            this.callbackAll = callbackAll;
        }
    }
    observe(callback:any){
        if (this.resolved) {
           callback()
        } else {
            // otherwise, queue up the callback for later
            this.callbacks.push(callback);
        }
    }
}