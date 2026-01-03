#!/usr/bin/env node

/**
 * MCP Server for Evernote Integration
 * This is an example of how to create an MCP server that connects to Evernote
 * and can be used with your  app
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const Evernote = require('evernote');

class EvernoteMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'evernote-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_evernote_notebooks',
            description: 'Get all notebooks from Evernote',
            inputSchema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  description: 'Evernote access token',
                },
              },
              required: ['accessToken'],
            },
          },
          {
            name: 'get_evernote_notes',
            description: 'Get notes from a specific Evernote notebook',
            inputSchema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  description: 'Evernote access token',
                },
                notebookGuid: {
                  type: 'string',
                  description: 'Notebook GUID to fetch notes from',
                },
                maxNotes: {
                  type: 'number',
                  description: 'Maximum number of notes to fetch',
                  default: 50,
                },
              },
              required: ['accessToken', 'notebookGuid'],
            },
          },
          {
            name: 'get_evernote_note_content',
            description: 'Get full content of a specific Evernote note',
            inputSchema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  description: 'Evernote access token',
                },
                noteGuid: {
                  type: 'string',
                  description: 'Note GUID to fetch content from',
                },
              },
              required: ['accessToken', 'noteGuid'],
            },
          },
          {
            name: 'import_evernote_note_as_card',
            description: 'Import an Evernote note and convert it to a  card',
            inputSchema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  description: 'Evernote access token',
                },
                noteGuid: {
                  type: 'string',
                  description: 'Note GUID to import',
                },
                userId: {
                  type: 'string',
                  description: 'User ID for the card',
                },
              },
              required: ['accessToken', 'noteGuid', 'userId'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_evernote_notebooks':
            return await this.getNotebooks(args.accessToken);

          case 'get_evernote_notes':
            return await this.getNotes(
              args.accessToken,
              args.notebookGuid,
              args.maxNotes || 50
            );

          case 'get_evernote_note_content':
            return await this.getNoteContent(args.accessToken, args.noteGuid);

          case 'import_evernote_note_as_card':
            return await this.importNoteAsCard(
              args.accessToken,
              args.noteGuid,
              args.userId
            );

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async getNotebooks(accessToken) {
    try {
      const client = new Evernote.Client({
        token: accessToken,
        sandbox: false,
        china: false,
      });
      const noteStore = client.getNoteStore();
      const notebooks = await noteStore.listNotebooks();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              notebooks: notebooks.map((notebook) => ({
                guid: notebook.guid,
                name: notebook.name,
                noteCount: notebook.noteCount || 0,
              })),
            }),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to fetch notebooks: ${error.message}`);
    }
  }

  async getNotes(accessToken, notebookGuid, maxNotes) {
    try {
      const client = new Evernote.Client({
        token: accessToken,
        sandbox: false,
        china: false,
      });
      const noteStore = client.getNoteStore();

      const filter = new Evernote.NoteFilter();
      filter.notebookGuid = notebookGuid;

      const spec = new Evernote.NotesMetadataResultSpec({
        includeTitle: true,
        includeContentLength: true,
        includeCreated: true,
        includeUpdated: true,
        includeDeleted: false,
        includeNotebookGuid: true,
        includeTagGuids: true,
      });

      const result = await noteStore.findNotesMetadata(filter, 0, maxNotes, spec);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              notes: result.notes.map((note) => ({
                guid: note.guid,
                title: note.title,
                created: note.created,
                updated: note.updated,
                contentLength: note.contentLength,
                tagGuids: note.tagGuids,
              })),
            }),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }
  }

  async getNoteContent(accessToken, noteGuid) {
    try {
      const client = new Evernote.Client({
        token: accessToken,
        sandbox: false,
        china: false,
      });
      const noteStore = client.getNoteStore();
      const note = await noteStore.getNote(noteGuid, true, false, false, false);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              guid: note.guid,
              title: note.title,
              content: note.content,
              created: note.created,
              updated: note.updated,
              notebookGuid: note.notebookGuid,
              tagGuids: note.tagGuids,
            }),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to fetch note content: ${error.message}`);
    }
  }

  async importNoteAsCard(accessToken, noteGuid, userId) {
    try {
      // Get the note content
      const noteContent = await this.getNoteContent(accessToken, noteGuid);
      const note = JSON.parse(noteContent.content[0].text);

      // Process the content (you would integrate with your content processor)
      const processedContent = this.processNoteContent(note.content);

      // Create card data
      const cardData = {
        title: note.title,
        content: processedContent.text,
        type: processedContent.type,
        category: processedContent.category,
        tags: processedContent.tags,
        source: `Evernote: ${note.title}`,
        user: userId,
        metadata: {
          evernoteGuid: noteGuid,
          importedAt: new Date().toISOString(),
          originalContent: note.content,
        },
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              card: cardData,
              message: 'Note successfully converted to card format',
            }),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to import note as card: ${error.message}`);
    }
  }

  processNoteContent(content) {
    // Simple content processing - you would integrate with your existing content processor
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const words = text.split(/\s+/).length;
    
    let type = 'concept';
    if (words < 50) type = 'quote';
    else if (text.includes('1.') || text.includes('•')) type = 'checklist';
    else if (text.includes('action') || text.includes('step')) type = 'action';

    return {
      text: text.trim(),
      type,
      category: 'Imported',
      tags: ['evernote', 'imported'],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Evernote MCP Server running on stdio');
  }
}

// Run the server
const server = new EvernoteMCPServer();
server.run().catch(console.error);
