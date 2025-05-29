//package com.sp_productservice.config;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
//import com.fasterxml.jackson.databind.SerializationFeature;
//import com.fasterxml.jackson.databind.type.CollectionType;
//import com.fasterxml.jackson.databind.type.TypeFactory;
//import org.springframework.cache.CacheManager;
//import org.springframework.cache.annotation.EnableCaching;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.redis.cache.RedisCacheConfiguration;
//import org.springframework.data.redis.cache.RedisCacheManager;
//import org.springframework.data.redis.connection.RedisConnectionFactory;
//import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
//import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
//import org.springframework.data.redis.serializer.RedisSerializationContext;
//import org.springframework.data.redis.serializer.StringRedisSerializer;
//
//import java.time.Duration;
//
//@Configuration
//@EnableCaching
//public class RedisConfig {
//
//    @Bean
//    public ObjectMapper redisObjectMapper() {
//        ObjectMapper objectMapper = new ObjectMapper();
//        objectMapper.registerModule(new JavaTimeModule());
//        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//        objectMapper.activateDefaultTyping(objectMapper.getPolymorphicTypeValidator(),
//                ObjectMapper.DefaultTyping.NON_FINAL);
//        return objectMapper;
//    }
//
//    @Bean
//    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
//        GenericJackson2JsonRedisSerializer jsonSerializer =
//                new GenericJackson2JsonRedisSerializer(redisObjectMapper());
//
//        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
//                .entryTtl(Duration.ofHours(1))
//                .serializeKeysWith(RedisSerializationContext.SerializationPair
//                        .fromSerializer(new StringRedisSerializer()))
//                .serializeValuesWith(RedisSerializationContext.SerializationPair
//                        .fromSerializer(jsonSerializer))
//                .disableCachingNullValues();
//
//        return RedisCacheManager.builder(redisConnectionFactory)
//                .cacheDefaults(config)
//                .transactionAware()
//                .build();
//    }
//}