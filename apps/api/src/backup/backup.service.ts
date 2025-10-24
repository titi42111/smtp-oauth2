import { Injectable } from '@nestjs/common';

@Injectable()
export class BackupService {
  async exportConfiguration() {
    return {
      exportedAt: new Date().toISOString(),
      message: 'Export de configuration non implémenté'
    };
  }

  async importConfiguration() {
    return {
      importedAt: new Date().toISOString(),
      message: 'Import de configuration non implémenté'
    };
  }
}
