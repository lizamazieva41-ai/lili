import { User } from '../../common/interfaces/common.interfaces';
import { SessionInfo } from '../session-management.service';

/**
 * Authenticated user interface
 * Extends User with session information
 */
export interface AuthenticatedUser extends User {
  session?: SessionInfo;
  apiKey?: any;
  license?: any;
}
