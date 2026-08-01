package com.agritech.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class SchedulerConfig {
    // Enables @Scheduled jobs across the app —
    // e.g. periodic satellite scene polling, weather refresh, stale-prediction cleanup.
}