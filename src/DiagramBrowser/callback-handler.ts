import _ from 'the-lodash';
import { IClosable } from '@kubevious/ui-framework/dist';
import { v4 as uuidv4 } from 'uuid';

export class CallbackHandler<T>
{
    private _handlers : Record<string, T> = {};

    close()
    {
        this._handlers = {};
    }

    on(cb: T) : IClosable
    {
        const id = uuidv4();
        this._handlers[id] = cb;
        return {
            close: () => {
                delete this._handlers[id];
            }
        }
    }

    execute(cb: (cb : T) => any)
    {
        for(const handler of _.values(this._handlers))
        {
            cb(handler);
        }
    }
}