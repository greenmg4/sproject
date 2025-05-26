package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//** WebMvcConfigurer
//=> 스프링부트의 자동설정에 원하는 설정을 추가설정 할수있는 메서드들을 제공하는 인터페이스. 
//=> CORS 방침 설정 
//	-> addCorsMappings() : 프로젝트 전역설정
//	-> @CrossOrigin : 컨트롤러 또는 메서드 단위 CORS 설정

@Configuration
public class WebMvcConfig implements WebMvcConfigurer  {
	
	//** React & SpringBoot CORS 프로젝트단위 설정
	private final long MAX_AGE_SECS = 3600; //단위: 초
	
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		 
		registry.addMapping("/**")  //애플리케이션의 모든 엔드포인트에 대한 CORS매핑추가
				.allowedOrigins("http://localhost:3000", "http://localhost:3001")
				.allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
				// => CORS정책상 접근 가능한 origin인지 확인하기 위해 preflight를 보내는데, 
				//    이때 메소드가 'OPTIONS' 이므로 반드시 추가	
				.allowedHeaders("*")
				.allowCredentials(true)
				// => credentials true와 origins "*" 값은 공존할 수 없음
				//    (그러므로 origins 속성값은 구체적으로 명시함) 
				.maxAge(MAX_AGE_SECS);
	} //addCorsMappings	/------------------
	
	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploadimages/**")
                .addResourceLocations("file:///C:/Users/USER/git/sproject/uploadimages/");
        // ↑ 실제 파일 시스템 경로를 매핑
    }

}
