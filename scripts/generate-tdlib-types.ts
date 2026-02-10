#!/usr/bin/env ts-node
/// <reference types="node" />
/**
 * TDLib TypeScript Type Generator
 * 
 * Parses td_api.tl schema file and generates TypeScript type definitions
 */

const fs = require('fs');
const path = require('path');

interface Field {
  name: string;
  type: string;
  optional: boolean;
  description?: string;
}

interface TypeDefinition {
  name: string;
  baseType?: string;
  fields: Field[];
  description?: string;
  isClass: boolean;
  isFunction: boolean;
}

interface ParsedSchema {
  types: Map<string, TypeDefinition>;
  classes: Map<string, TypeDefinition[]>;
  functions: TypeDefinition[];
}

// Type mappings from TL to TypeScript
const TYPE_MAPPINGS: Record<string, string> = {
  'int32': 'number',
  'int53': 'number',
  'int64': 'string', // Use string for int64 to avoid precision issues
  'double': 'number',
  'string': 'string',
  'bytes': 'string', // Base64 encoded
  'Bool': 'boolean',
  'Double': 'number',
  'String': 'string',
  'Int32': 'number',
  'Int53': 'number',
  'Int64': 'string',
  'Bytes': 'string',
  'Error': 'TdlibError',
  'Ok': 'TdlibOk',
};

function parseType(tlType: string): string {
  // Handle optional types
  if (tlType.endsWith('?')) {
    return parseType(tlType.slice(0, -1)) + ' | null';
  }

  // Handle vectors
  if (tlType.startsWith('vector<')) {
    const innerType = tlType.slice(7, -1).trim();
    return `Array<${parseType(innerType)}>`;
  }

  // Handle built-in types
  if (TYPE_MAPPINGS[tlType]) {
    return TYPE_MAPPINGS[tlType];
  }

  // Handle generic types
  if (tlType.includes('{')) {
    // Extract base type
    const match = tlType.match(/^(\w+)\s*\{/);
    if (match) {
      return match[1];
    }
  }

  // Convert to PascalCase for TypeScript
  return tlType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function parseField(fieldStr: string): Field | null {
  // Match: fieldName:Type or fieldName?:Type
  // Handle cases like: field:Type, field?:Type, field:vector<Type>
  const match = fieldStr.match(/^(\w+)(\?)?\s*:\s*(.+?)$/);
  if (!match) return null;

  const [, name, optional, typeStr] = match;

  // Parse the type, handling vectors and generics
  let type = typeStr.trim();

  return {
    name,
    type: parseType(type),
    optional: !!optional,
  };
}

function parseTypeDefinition(line: string, description: string = ''): TypeDefinition | null {
  // Match patterns:
  // 1. typeName field1:Type1 field2:Type2 = BaseType;
  // 2. typeName = BaseType; (no fields)
  const matchWithFields = line.match(/^(\w+)\s+(.+?)\s*=\s*(\w+);?$/);
  const matchNoFields = line.match(/^(\w+)\s*=\s*(\w+);?$/);

  let name: string;
  let fieldsStr: string | null = null;
  let baseType: string;

  if (matchWithFields) {
    [, name, fieldsStr, baseType] = matchWithFields;
  } else if (matchNoFields) {
    [, name, baseType] = matchNoFields;
  } else {
    return null;
  }

  // Parse fields
  const fields: Field[] = [];
  if (fieldsStr) {
    // Split by field boundaries: look for pattern "word? :" or "word :"
    // This regex finds field boundaries more accurately
    const fieldPattern = /(\w+\??)\s*:\s*([^\s]+(?:\s*<[^>]+>)?(?:\s*\{[^}]+\})?)/g;
    let fieldMatch;

    while ((fieldMatch = fieldPattern.exec(fieldsStr)) !== null) {
      const fullMatch = fieldMatch[0];
      const field = parseField(fullMatch);
      if (field) {
        fields.push(field);
      }
    }

    // Fallback: if regex didn't work, try simpler split
    if (fields.length === 0) {
      // Split by spaces but be careful with type names that have spaces
      const parts = fieldsStr.split(/\s+(?=\w+[?:]?\s*:)/);
      for (const part of parts) {
        const field = parseField(part.trim());
        if (field) {
          fields.push(field);
        }
      }
    }
  }

  // Check if it's a function (starts with lowercase and base type is Ok/Error)
  const isFunction = name[0] === name[0].toLowerCase() &&
    (baseType === 'Ok' || baseType === 'Error');

  return {
    name,
    baseType,
    fields,
    description: description.trim() || undefined,
    isClass: false,
    isFunction,
  };
}

function parseSchema(schemaPath: string): ParsedSchema {
  const content = fs.readFileSync(schemaPath, 'utf-8');
  const lines = content.split('\n');

  const types = new Map<string, TypeDefinition>();
  const classes = new Map<string, TypeDefinition[]>();
  const functions: TypeDefinition[] = [];

  let currentDescription = '';
  let currentClass: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines and comments (except description comments)
    if (!line || line.startsWith('//') && !line.includes('@')) {
      continue;
    }

    // Extract description
    if (line.startsWith('//@description')) {
      currentDescription = line.replace('//@description', '').trim();
      continue;
    }

    // Extract class marker
    if (line.includes('@class')) {
      const classMatch = line.match(/@class\s+(\w+)/);
      if (classMatch) {
        currentClass = classMatch[1];
        if (currentClass && !classes.has(currentClass)) {
          classes.set(currentClass, []);
        }
      }
      continue;
    }

    // Parse type definition
    if (line.match(/^\w+\s+.*=\s*\w+/)) {
      const def = parseTypeDefinition(line, currentDescription);
      if (def) {
        if (def.isFunction) {
          functions.push(def);
        } else {
          types.set(def.name, def);

          if (currentClass && def.baseType === currentClass) {
            const classVariants = classes.get(currentClass);
            if (classVariants) {
              classVariants.push(def);
            }
          }
        }
      }
      currentDescription = '';
    }
  }

  return { types, classes, functions };
}

function generateTypeScriptTypes(schema: ParsedSchema): string {
  const output: string[] = [];

  output.push('/**');
  output.push(' * TDLib TypeScript Type Definitions');
  output.push(' * Auto-generated from td_api.tl schema');
  output.push(' * DO NOT EDIT MANUALLY - This file is auto-generated');
  output.push(' */');
  output.push('');
  output.push('// Base types');
  output.push('export interface TdlibError {');
  output.push('  "@type": "error";');
  output.push('  code: number;');
  output.push('  message: string;');
  output.push('}');
  output.push('');
  output.push('export interface TdlibOk {');
  output.push('  "@type": "ok";');
  output.push('}');
  output.push('');

  // Generate union types for classes
  for (const [className, variants] of schema.classes.entries()) {
    if (variants.length > 0) {
      output.push(`// ${className} variants`);
      const variantNames = variants.map(v => `Tdlib${v.name}`);
      output.push(`export type Tdlib${className} = ${variantNames.join(' | ')};`);
      output.push('');
    }
  }

  // Generate type definitions
  output.push('// Type definitions');
  for (const [name, def] of schema.types.entries()) {
    if (def.fields.length === 0 && !def.baseType) {
      // Empty type (like Ok)
      output.push(`export interface Tdlib${name} {`);
      output.push(`  "@type": "${name}";`);
      output.push('}');
    } else if (def.fields.length > 0) {
      output.push(`export interface Tdlib${name} {`);
      output.push(`  "@type": "${name}";`);

      for (const field of def.fields) {
        const optional = field.optional ? '?' : '';
        const comment = field.description ? ` // ${field.description}` : '';
        output.push(`  ${field.name}${optional}: ${field.type};${comment}`);
      }

      output.push('}');
    }
    output.push('');
  }

  // Generate function request types
  output.push('// Function request types');
  for (const func of schema.functions) {
    output.push(`export interface Tdlib${func.name}Request {`);
    output.push(`  "@type": "${func.name}";`);

    for (const field of func.fields) {
      const optional = field.optional ? '?' : '';
      output.push(`  ${field.name}${optional}: ${field.type};`);
    }

    output.push('}');
    output.push('');
  }

  // Generate union type for all requests
  const requestTypes = schema.functions.map(f => `Tdlib${f.name}Request`);
  output.push('export type TdlibRequest =');
  output.push('  | ' + requestTypes.join('\n  | '));
  output.push(';');
  output.push('');

  // Generate union type for all responses
  const responseTypes = Array.from(schema.types.keys())
    .map(name => `Tdlib${name}`)
    .concat(['TdlibError', 'TdlibOk']);
  output.push('export type TdlibResponse =');
  output.push('  | ' + responseTypes.join('\n  | '));
  output.push(';');
  output.push('');

  // Generate update types (types that start with "update")
  const updateTypes = Array.from(schema.types.keys())
    .filter(name => name.startsWith('update'))
    .map(name => `Tdlib${name}`);
  if (updateTypes.length > 0) {
    output.push('export type TdlibUpdate =');
    output.push('  | ' + updateTypes.join('\n  | '));
    output.push(';');
    output.push('');
  }

  return output.join('\n');
}

function main() {
  // Get current directory (CommonJS)
  const currentDir = __dirname || process.cwd();
  const projectRoot = path.resolve(currentDir, '..');
  // Schema is at vendor/tdlib/source/td/generate/scheme/td_api.tl
  const schemaPath = path.resolve(projectRoot, 'vendor', 'tdlib', 'source', 'td', 'generate', 'scheme', 'td_api.tl');
  const outputDir = path.resolve(projectRoot, 'src', 'tdlib', 'types');
  const outputPath = path.resolve(outputDir, 'tdlib-api.types.ts');

  console.log('Parsing TDLib schema...');
  console.log(`Schema path: ${schemaPath}`);

  if (!fs.existsSync(schemaPath)) {
    console.error(`Error: Schema file not found at ${schemaPath}`);
    process.exit(1);
  }

  const schema = parseSchema(schemaPath);
  console.log(`Parsed ${schema.types.size} types, ${schema.functions.length} functions, ${schema.classes.size} classes`);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const tsCode = generateTypeScriptTypes(schema);
  fs.writeFileSync(outputPath, tsCode, 'utf-8');

  console.log(`Generated TypeScript types: ${outputPath}`);
  console.log('Done!');
}

if (require.main === module) {
  main();
}
