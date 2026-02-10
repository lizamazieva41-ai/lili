#!/usr/bin/env ts-node
/// <reference types="node" />
/**
 * TDLib API Documentation Generator
 * 
 * Auto-generates API documentation from TypeScript types and API mapping
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const apiMappingPath = path.resolve(projectRoot, 'docs/tdlib-api-mapping.json');
const outputPath = path.resolve(projectRoot, 'docs/api/tdlib-api-reference.md');

interface ApiMapping {
  tdApiMethod: string;
  nodeEndpoint: string;
  service: string;
  status: string;
}

function generateApiDocs(): void {
  console.log('Generating TDLib API documentation...');

  // Read API mapping
  const apiMapping: ApiMapping[] = JSON.parse(
    fs.readFileSync(apiMappingPath, 'utf-8'),
  );

  // Group by service
  const byService = new Map<string, ApiMapping[]>();
  for (const mapping of apiMapping) {
    const serviceName = mapping.service.split('.')[0];
    if (!byService.has(serviceName)) {
      byService.set(serviceName, []);
    }
    byService.get(serviceName)!.push(mapping);
  }

  // Generate markdown
  let markdown = `# TDLib API Reference\n\n`;
  markdown += `**Generated**: ${new Date().toISOString()}\n\n`;
  markdown += `**Total Methods**: ${apiMapping.length}\n\n`;
  markdown += `---\n\n`;

  // Table of contents
  markdown += `## Table of Contents\n\n`;
  for (const serviceName of Array.from(byService.keys()).sort()) {
    markdown += `- [${serviceName}](#${serviceName.toLowerCase()})\n`;
  }
  markdown += `\n---\n\n`;

  // Generate sections for each service
  for (const [serviceName, mappings] of Array.from(byService.entries()).sort()) {
    markdown += `## ${serviceName}\n\n`;
    markdown += `**Total Methods**: ${mappings.length}\n\n`;

    markdown += `| Method | Endpoint | Service Method | Status |\n`;
    markdown += `|--------|----------|----------------|--------|\n`;

    for (const mapping of mappings.sort((a, b) =>
      a.tdApiMethod.localeCompare(b.tdApiMethod),
    )) {
      markdown += `| \`${mapping.tdApiMethod}\` | \`${mapping.nodeEndpoint}\` | \`${mapping.service}\` | ${mapping.status} |\n`;
    }

    markdown += `\n`;
  }

  // Summary
  markdown += `---\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- **Implemented**: ${apiMapping.filter(m => m.status === 'implemented').length}\n`;
  markdown += `- **Planned**: ${apiMapping.filter(m => m.status === 'planned').length}\n`;
  markdown += `- **Not Used**: ${apiMapping.filter(m => m.status === 'not_used').length}\n`;

  // Write to file
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, markdown, 'utf-8');
  console.log(`✅ API documentation generated: ${outputPath}`);
  console.log(`   Total methods: ${apiMapping.length}`);
}

if (require.main === module) {
  generateApiDocs();
}

export { generateApiDocs };
