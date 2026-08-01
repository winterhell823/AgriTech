package com.agritech.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI agriTechOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AgriTech — Crop Intelligence & Moisture Stress Monitoring API")
                        .description("REST API for crop classification, phenology tracking, "
                                + "moisture stress detection, and GIS field intelligence")
                        .version("v1.0"));
    }
}