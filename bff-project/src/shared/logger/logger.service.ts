import { Injectable, Logger} from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger();

  /**
   * Log au niveau DEBUG - Données détaillées pour debugging
   * Utilisé dans: Repository, opérations techniques
   */
  debug(context: string, message: string, data?: any) {
    this.logger.debug(
      `${message}${data ? ` | ${JSON.stringify(data)}` : ''}`,
      context,
    );
  }

  /**
   * Log au niveau INFO - Opérations importantes
   * Utilisé dans: Service, opérations métier réussies
   */
  log(context: string, message: string, data?: any) {
    this.logger.log(
      `${message}${data ? ` | ${JSON.stringify(data)}` : ''}`,
      context,
    );
  }

  /**
   * Log au niveau WARN - Avertissements, situations anormales
   * Utilisé dans: Service, ressources non trouvées, erreurs métier
   */
  warn(context: string, message: string, data?: any) {
    this.logger.warn(
      `${message}${data ? ` | ${JSON.stringify(data)}` : ''}`,
      context,
    );
  }

  /**
   * Log au niveau ERROR - Erreurs système graves
   * Utilisé dans: Exception Filter, erreurs non gérées
   */
  error(context: string, message: string, error?: any, data?: any) {
    const errorStack = error?.stack || error?.toString() || '';
    const errorInfo = data ? ` | ${JSON.stringify(data)}` : '';
    this.logger.error(
      `${message}${errorInfo}\n${errorStack}`,
      errorStack,
      context,
    );
  }

  /**
   * Log structuré pour les opérations HTTP
   */
  http(
    context: string,
    method: string,
    path: string,
    statusCode: number,
    duration: number,
  ) {
    this.logger.log(
      `${method} ${path} - ${statusCode} (${duration}ms)`,
      context,
    );
  }
}
