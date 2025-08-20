// Re-export the appropriate service based on usage context
// For server components, use talentServerService
// For client components, use talentClientService

export { talentServerService as talentService } from './talent.server.service';
export { talentClientService } from './talent.client.service';