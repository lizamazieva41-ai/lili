#!/usr/bin/env ts-node
/**
 * Integration test script for proxy testing functionality
 * 
 * This script tests the proxy testing implementation by:
 * 1. Creating a test proxy (or using existing one)
 * 2. Testing the proxy connectivity
 * 3. Verifying the results
 * 
 * Usage:
 *   ts-node scripts/test-proxy-integration.ts [proxy-id]
 * 
 * Environment variables:
 *   PROXY_TEST_ENDPOINT - Endpoint to test against (default: https://httpbin.org/ip)
 *   PROXY_TEST_TIMEOUT_MS - Timeout in milliseconds (default: 10000)
 *   DATABASE_URL - PostgreSQL connection string
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ProxiesService } from '../src/proxies/proxies.service';
import { ProxyType } from '../src/proxies/dto/create-proxy.dto';

async function main() {
  const proxyId = process.argv[2];
  const testEndpoint = process.env.PROXY_TEST_ENDPOINT || 'https://httpbin.org/ip';
  const testTimeout = parseInt(process.env.PROXY_TEST_TIMEOUT_MS || '10000', 10);

  console.log('🚀 Starting proxy integration test...');
  console.log(`   Test endpoint: ${testEndpoint}`);
  console.log(`   Timeout: ${testTimeout}ms`);
  console.log('');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const proxiesService = app.get(ProxiesService);

  try {
    let proxyIdToTest: string;

    if (proxyId) {
      // Use provided proxy ID
      console.log(`📋 Testing existing proxy: ${proxyId}`);
      proxyIdToTest = proxyId;
    } else {
      // Create a test proxy (you should replace with a real test proxy)
      console.log('⚠️  No proxy ID provided. Creating a test proxy...');
      console.log('   NOTE: Replace the proxy details below with a real test proxy!');
      
      const testProxy = await proxiesService.create(
        {
          name: 'Integration Test Proxy',
          type: ProxyType.HTTP,
          host: process.env.TEST_PROXY_HOST || '127.0.0.1',
          port: parseInt(process.env.TEST_PROXY_PORT || '8080', 10),
          username: process.env.TEST_PROXY_USERNAME,
          password: process.env.TEST_PROXY_PASSWORD,
          country: 'US',
          region: 'Test',
          tags: ['integration-test'],
          notes: 'Created by integration test script',
        },
        'integration-test-user',
      );

      proxyIdToTest = testProxy.id;
      console.log(`✅ Created test proxy: ${proxyIdToTest}`);
      console.log('');
    }

    // Test the proxy
    console.log('🧪 Testing proxy connectivity...');
    const startTime = Date.now();
    const result = await proxiesService.testProxy(proxyIdToTest);
    const totalTime = Date.now() - startTime;

    console.log('');
    console.log('📊 Test Results:');
    console.log(`   Status: ${result.status.toUpperCase()}`);
    console.log(`   Working: ${result.isWorking ? '✅ YES' : '❌ NO'}`);
    console.log(`   Response Time: ${result.responseTime}ms`);
    console.log(`   Total Time: ${totalTime}ms`);
    if (result.detectedIp) {
      console.log(`   Detected IP: ${result.detectedIp}`);
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log(`   Tested At: ${result.testedAt.toISOString()}`);
    console.log('');

    // Verify results
    if (result.isWorking) {
      console.log('✅ Proxy test PASSED - Proxy is healthy and working');
      process.exit(0);
    } else {
      console.log('❌ Proxy test FAILED - Proxy is not working');
      console.log(`   Reason: ${result.error || 'Unknown error'}`);
      process.exit(1);
    }
  } catch (error: any) {
    console.error('');
    console.error('❌ Integration test failed:');
    console.error(`   Error: ${error.message}`);
    if (error.stack) {
      console.error(`   Stack: ${error.stack}`);
    }
    process.exit(1);
  } finally {
    await app.close();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
