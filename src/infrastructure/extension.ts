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
	const date = new Date()
	const dateAsString = moment(date).format("YYYY-MM-DD - HH:mm")
	const dateForPath = moment(date).format("YYYY-MM-DD-HH-mm")
	const mdFile = dateForPath + ".md"
	const file = path.join(root, mdFile)
	fs.writeFileSync(file, `---\ntitle: ${dateAsString}\n---\n\n`)
	vscode.window.showTextDocument(vscode.Uri.file(file))
}

const log = vscode.window.createOutputChannel("Extension: Log Entry")

export function activate(vscontext: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand("le.createLogEntry", createLogEntryAsync);
	vscontext.subscriptions.push(disposable);
	log.appendLine("LOG: Loaded")
}

export function deactivate() { }
