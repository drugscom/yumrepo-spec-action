import * as core from '@actions/core'
import * as fs from 'fs'
import * as utils from '@actions/utils'

function run(): void {
  try {
    const baseURL = core.getInput('baseurl')
    const description = core.getInput('description')
    const GPGKey = core.getInput('gpg-key')
    const name = core.getInput('name')
    const packager = core.getInput('packager')
    const release = core.getInput('release')
    const requires = core.getInput('requires')
    const summary = core.getInput('summary')
    const URL = core.getInput('url')
    const version = core.getInput('version')

    if (utils.pathExists(`${name}-release`)) {
      core.setFailed(`Path already exists: ${name}-release`)
      process.exit(1)
    }

    fs.mkdirSync(`${name}-release/SPECS`, {recursive: true})
    const spec = fs.createWriteStream(`${name}-release/SPECS/${name}-release.spec`)
    spec.on('error', function (err: Error) {
      core.setFailed(err)
      process.exit(1)
    })

    spec.write(`Name:      ${name}-release\n`)
    spec.write(`Summary:   ${summary}\n`)
    spec.write(`Version:   ${version}\n`)
    spec.write(`Release:   ${release}\n`)
    spec.write('Group:     System Environment/Base\n')
    spec.write('License:   GPLv2\n')
    spec.write(`URL:       ${URL}\n`)
    spec.write(`Packager:  ${packager}\n`)
    spec.write('BuildArch: noarch\n')
    if (requires) {
      spec.write(`Requires:  ${requires}\n`)
    }
    spec.write('\n')
    if (description) {
      spec.write('%description\n')
      spec.write(description)
      spec.write('\n\n')
    }
    spec.write('%install\n')
    spec.write("%{__install} -d '%{buildroot}%{_sysconfdir}/yum.repos.d'\n")
    spec.write(`%{__cat} <<'EEOF' >'%{buildroot}%{_sysconfdir}/yum.repos.d/${name}.repo'\n`)
    spec.write(`[${name}]\n`)
    spec.write(`name=${summary} - $basearch\n`)
    spec.write(`baseurl=${baseURL}/$basearch\n`)
    spec.write('enabled=1\n')
    if (GPGKey) {
      spec.write('repo_gpgcheck=1\n')
      spec.write('gpgcheck=1\n')
      spec.write(`gpgkey=${GPGKey}\n`)
    }
    spec.write('\n')
    spec.write(`[${name}-source]\n`)
    spec.write(`name=${summary} - Source\n`)
    spec.write(`baseurl=${baseURL}/Source\n`)
    spec.write('enabled=0\n')
    if (GPGKey) {
      spec.write('repo_gpgcheck=1\n')
      spec.write('gpgcheck=1\n')
      spec.write(`gpgkey=${GPGKey}\n`)
    }
    spec.write('EEOF\n')
    spec.write('\n')
    spec.write('%clean\n')
    spec.write('%{__rm} -rf %{buildroot}\n')
    spec.write('\n')
    spec.write('%files\n')
    spec.write('%defattr(644,root,root,755)\n')
    spec.write('%config(noreplace) /etc/yum.repos.d/*\n')
    spec.write('\n')
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    core.setFailed(error.message)
  }
}

void run()
