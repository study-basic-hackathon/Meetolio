package com.example.meetolio_api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication(
    exclude = [org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration::class]
)
class MeetolioApiApplication

fun main(args: Array<String>) {
	runApplication<MeetolioApiApplication>(*args)
}
