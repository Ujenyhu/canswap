import { SocketService } from '../../../SocketService';
/**
 * Checks the focus status of the document and triggers socket reconnection if necessary.
 * If the document has focus, it immediately calls the reconnectSocket function to attempt reconnection.
 * If the document doesn't have focus, it sets up a focus event listener to trigger reconnection once the document regains focus.
 * The focus event listener is added only once per SocketService instance.
 *
 * @param instance The current instance of the SocketService.
 */
export declare function setupSocketFocusListener(instance: SocketService): void;
//# sourceMappingURL=setupSocketFocusListener.d.ts.map