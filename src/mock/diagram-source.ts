import { MockDiagramService } from "./services/diagram-service";
import { DiagramSource} from '../service/diagram-source';

const svc = new MockDiagramService();
export const MyDiagramSource = new DiagramSource(svc);