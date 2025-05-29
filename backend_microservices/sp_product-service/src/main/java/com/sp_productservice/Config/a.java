//// RateLimitingConfig.java
//package com.sp_productservice.Config;
//
//import io.github.bucket4j.distributed.proxy.ProxyManager;
//import io.github.bucket4j.redis.jedis.cas.JedisBasedProxyManager;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import redis.clients.jedis.JedisPool;
//import redis.clients.jedis.JedisPoolConfig;
//
//@Configuration
//public class RateLimitingConfig {
//
//    @Bean
//    public JedisPool jedisPool() {
//        JedisPoolConfig poolConfig = new JedisPoolConfig();
//        poolConfig.setMaxTotal(128);
//        poolConfig.setMaxIdle(128);
//        poolConfig.setMinIdle(16);
//        poolConfig.setTestOnBorrow(true);
//        poolConfig.setTestOnReturn(true);
//        poolConfig.setTestWhileIdle(true);
//
//        // Configure Redis connection - adjust host and port as needed
//        return new JedisPool(poolConfig, "localhost", 6379);
//    }
//
//    @Bean
//    public ProxyManager<String> proxyManager(JedisPool jedisPool) {
//        return new JedisBasedProxyManager<>(jedisPool);
//    }
//}