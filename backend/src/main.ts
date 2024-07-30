import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
    });

    // const config = new DocumentBuilder()
    //   .setTitle("Dirnkcollab")
    //   .setDescription("Drinkcollab description")
    //   .setVersion("1.0")
    //   .build();

    //   const document = SwaggerModule.createDocument(app, config);
    //   SwaggerModule.setup("api", app, document)
    app.use(cookieParser());

    await app.listen(3000);
}
bootstrap();
