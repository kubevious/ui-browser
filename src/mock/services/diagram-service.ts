import { DiagramChildrenChangeCallback, IDiagramService, IDiagramServiceChildrenSubscriber } from "../../interfaces/diagram-service";

export class MockDiagramService implements IDiagramService
{

    subscribeToChildren(cb: DiagramChildrenChangeCallback) : IDiagramServiceChildrenSubscriber
    {
        return {
            update: (dnList : string[]) => {
                // cb(dnList[0], []);
            },
            close: () => {

            }
        }

    }



}

// export interface IDiagramServiceChildrenSubscriber
// {
//     update(dnList : string[]) : void;
//     close() : void;
// }