package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer  {
	
	//** React & SpringBoot CORS 프로젝트단위 설정
	private final long MAX_AGE_SECS = 3600; //단위: 초
	
	@Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")  //애플리케이션의 모든 엔드포인트에 대한 CORS매핑추가
                //.allowedOrigins("http://localhost:3000/", "http://localhost:3001")
                .allowedOrigins("http://3.38.127.157:3000", "http://3.38.127.157:8080", "http://3.38.127.157")
                .allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(MAX_AGE_SECS);
    } //addCorsMappings    /------------------

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploadimages/")
                .addResourceLocations("file:///C:/Users/USER/git/sproject/uploadimages/");
        // ↑ 실제 파일 시스템 경로를 매핑
    }	

}
