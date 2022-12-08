type ObserveCallBack = (...args: any[]) => void;
type DoneCallBack = () => void;
type ErrorCallBack = (error: Error) => void;

export class Watch{
    observeCallbacks:ObserveCallBack[] = [];
    onDoneCallBack:DoneCallBack = ()=>{};
    callbackAll:any;
    resolved:boolean = false;
    ready:boolean = false;
    resolvedAll:boolean = false;
    data:any[] = []
    // all:any[] = []

    errorCallback:ErrorCallBack = (error:Error)=>{};

    resolve(data:any[]) {
        this.data = data
        // this.all = [...this.all, ...data]
        this.resolved = true;

        // fire all callbacks
        for(const observeCallback of this.observeCallbacks){
            observeCallback(data)
        }
    }
    complete(){
        this.ready = true;
        this.onDoneCallBack();

    }
    resolveException(data:Error){
        this.errorCallback(data)
    }

    observe(observeCallback:ObserveCallBack){
        if (this.resolved) {
            observeCallback()
        } else {
            // otherwise, queue up the callback for later
            this.observeCallbacks.push(observeCallback);
        }
        return this
    }

    done(doneCallBack:DoneCallBack){
        if (this.ready) {
            doneCallBack()
        } else {
            // otherwise, queue up the callback for later
            this.onDoneCallBack = doneCallBack;
        }
        return this
    }

    catch(errorCallback:ErrorCallBack){
        this.errorCallback = errorCallback
        return this
    }
}