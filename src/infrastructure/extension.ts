import * as vscode from 'vscode'
import * as fs from "fs"
import * as path from "path"
import * as moment from "moment"

async function createLogEntryAsync() {
	const folders = vscode.workspace.workspaceFolders
	if (folders === undefined) {
		vscode.window.showErrorMessage(`No folder is opened`)
		return
	}
	const root = folders[0].uri.fsPath
	const configuration = vscode.workspace.getConfiguration("le")
	const relativePath = configuration.get("newEntriesDefaultPath") as string
	const fileNameTemplate = configuration.get("fileNameFormat") as string
	const newEntryTemplate = configuration.get("newEntryTemplate") as string
	const date = new Date()
	const fileName = moment(date).format(fileNameTemplate)
	// Looks like the config UI isn't smart, so we're replacing by the special character
	const content = moment(date).format(newEntryTemplate
		.replace(/\\n/g, "\n")
		.replace(/\\t/g, "\t"))
	const file = path.join(root, relativePath, fileName)
	fs.writeFileSync(file, content)
	vscode.window.showTextDocument(vscode.Uri.file(file))
}

const log = vscode.window.createOutputChannel("Extension: Log Entry")

export function activate(vscontext: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand("le.createLogEntry", createLogEntryAsync);
	vscontext.subscriptions.push(disposable);
	log.appendLine("LOG: Loaded")
}

export function deactivate() { }
