# RPM specs matrix generator

This action generates RPM spec for a Yum repo.

## Inputs

### `name`

Repo name.

### `summary`

Summary.

### `url`

Information URL.

### `packager`

Packager.

### `version`

Package version. Default `"7"`.

### `release`

Package release version. Default `"1"`.

### `requires`

Package requirements. Default `"redhat-release >= 7"`.

### `description`

Long description.

### `baseurl`

Repo base URL.

### `gpg-key`

GPG signing key.


## Example usage

```yaml
uses: drugscom/yumrepo-spec-action@v1
with:
  name: exampleorg-utils
  summary: example.org private Yum repo
  url: https://example.org/yum
  packager: John Doe <j.doe@example.org>
  baseurl: https://yum.example/org/CentOS/7/dev
```