// AI Prompt builders for website generation

export function buildPlannerPrompt(orgSummaryJson: string, animalsCount: number): string[] {
  const plannerJsonSchema = {
    "type": "object",
    "properties": {
      "pages": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "key": {"type": "string"},
            "title": {"type": "string"},
            "path": {"type": "string"},
            "sections": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": ["header", "hero", "value-props", "about", "grid-animals", "testimonials", "cta", "faq", "contact", "footer"]
              }
            }
          },
          "required": ["key", "title", "path", "sections"],
          "additionalProperties": false
        }
      }
    },
    "required": ["pages"],
    "additionalProperties": false
  }

  return [
    `You are a website information architect. Given the ORGANIZATION BRIEF, return ONLY JSON that matches the provided JSON Schema.

Rules:
- Pages must be for an animal rescue site.
- Use only these section types: ["header","hero","value-props","about","grid-animals","testimonials","cta","faq","contact","footer"].
- Max 6 sections per page.
- The home page MUST include "grid-animals" if available_animal_count > 0.
- No prose, no markdown, no comments outside JSON.

ORGANIZATION BRIEF:
${orgSummaryJson}

Available Animals Count: ${animalsCount}

JSON SCHEMA:
${JSON.stringify(plannerJsonSchema, null, 2)}`
  ]
}

export function buildSectionCopyPrompt(sectionType: string, brandJson: string): string[] {
  // Define JSON schemas for each section type
  const sectionSchemas: Record<string, object> = {
    header: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["header"] },
        links: {
          type: "array",
          maxItems: 7,
          items: {
            type: "object",
            properties: {
              label: { type: "string", maxLength: 30 },
              href: { type: "string" }
            },
            required: ["label", "href"]
          }
        },
        showDonate: { type: "boolean" }
      },
      required: ["type", "links", "showDonate"]
    },
    hero: {
      type: "object", 
      properties: {
        type: { type: "string", enum: ["hero"] },
        heading: { type: "string", maxLength: 90 },
        subheading: { type: "string", maxLength: 180 },
        primaryCta: {
          type: "object",
          properties: {
            label: { type: "string", maxLength: 25 },
            href: { type: "string" }
          }
        },
        secondaryCta: {
          type: "object", 
          properties: {
            label: { type: "string", maxLength: 25 },
            href: { type: "string" }
          }
        }
      },
      required: ["type", "heading"]
    },
    "value-props": {
      type: "object",
      properties: {
        type: { type: "string", enum: ["value-props"] },
        heading: { type: "string", maxLength: 80 },
        items: {
          type: "array",
          minItems: 3,
          maxItems: 6,
          items: {
            type: "object",
            properties: {
              title: { type: "string", maxLength: 48 },
              description: { type: "string", maxLength: 140 }
            },
            required: ["title", "description"]
          }
        }
      },
      required: ["type", "heading", "items"]
    },
    about: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["about"] },
        heading: { type: "string", maxLength: 80 },
        body: { type: "string", maxLength: 600 }
      },
      required: ["type", "heading", "body"]
    },
    "grid-animals": {
      type: "object",
      properties: {
        type: { type: "string", enum: ["grid-animals"] },
        heading: { type: "string", maxLength: 80 },
        showFilters: { type: "boolean" },
        maxItems: { type: "number", minimum: 3, maximum: 24 }
      },
      required: ["type", "heading"]
    },
    testimonials: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["testimonials"] },
        heading: { type: "string", maxLength: 80 },
        items: {
          type: "array",
          minItems: 2,
          maxItems: 6,
          items: {
            type: "object",
            properties: {
              quote: { type: "string", maxLength: 220 },
              author: { type: "string", maxLength: 60 }
            },
            required: ["quote", "author"]
          }
        }
      },
      required: ["type", "heading", "items"]
    },
    cta: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["cta"] },
        heading: { type: "string", maxLength: 80 },
        body: { type: "string", maxLength: 200 },
        cta: {
          type: "object",
          properties: {
            label: { type: "string", maxLength: 25 },
            href: { type: "string" }
          },
          required: ["label", "href"]
        }
      },
      required: ["type", "heading", "cta"]
    },
    faq: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["faq"] },
        heading: { type: "string", maxLength: 80 },
        items: {
          type: "array",
          minItems: 3,
          maxItems: 8,
          items: {
            type: "object",
            properties: {
              q: { type: "string", maxLength: 100 },
              a: { type: "string", maxLength: 300 }
            },
            required: ["q", "a"]
          }
        }
      },
      required: ["type", "heading", "items"]
    },
    contact: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["contact"] },
        heading: { type: "string", maxLength: 80 },
        email: { type: "string", format: "email" },
        phone: { type: "string" },
        address: { type: "string" }
      },
      required: ["type", "heading", "email", "phone", "address"]
    },
    footer: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["footer"] },
        socials: {
          type: "array",
          maxItems: 6,
          items: {
            type: "object",
            properties: {
              platform: { type: "string" },
              href: { type: "string", format: "uri" }
            },
            required: ["platform", "href"]
          }
        },
        ein: { type: "string" },
        links: {
          type: "array",
          maxItems: 6,
          items: {
            type: "object",
            properties: {
              label: { type: "string", maxLength: 30 },
              href: { type: "string" }
            },
            required: ["label", "href"]
          }
        }
      },
      required: ["type", "socials", "ein", "links"]
    }
  }

  const schema = sectionSchemas[sectionType]
  if (!schema) {
    throw new Error(`Unknown section type: ${sectionType}`)
  }

  return [
    `You are a UX copywriter. Generate structured JSON for a "${sectionType}" section of an animal rescue website.
Tone: warm, trustworthy, action-oriented, 7–9th grade reading level.
Do not include HTML tags.

BRAND BRIEF:
${brandJson}

JSON SCHEMA (return MUST match exactly):
${JSON.stringify(schema, null, 2)}`
  ]
}
