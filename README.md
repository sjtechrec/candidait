# Candidait

Candidait is a human-centered career marketplace prototype for candidates and employers.

## Current status

The public website is hosted at [www.candidait.com](https://www.candidait.com/) using GitHub Pages. Its static HTML, CSS, JavaScript, fonts, and brand assets live at the repository root. Pages publishes from `main` and `/ (root)`. The `CNAME` file preserves the custom domain; `.nojekyll` serves the files without Jekyll processing.

The public site currently shows a coming-soon page with the brand header. Existing prototype routes also show this page, so unfinished features are not presented as available. The full static prototype is preserved on the `prototype/full-website` branch for continued development. Resume analysis, live AI search, real authentication, applications, and employer services are not connected to backend services.

- [Repository setup plan](docs/repository-setup-plan.md)
- [Roadmap](ROADMAP.md)
- [GitHub Project](https://github.com/users/sjtechrec/projects/2)
- [Documentation index](docs/README.md)
- [DevOps operating guide](DEVOPS.md) — CI/CD responsibilities, workflow inventory, and operating policies.

## Getting started

Clone the repository and enter the project directory:

```bash
git clone https://github.com/sjtechrec/candidait.git
cd candidait
```

No build or dependency installation is required for the static website. To preview it with Python 3, run `python -m http.server 3000` from the repository root, then open `http://localhost:3000/`. Use a local server rather than opening the HTML file directly, because links and assets use root-relative paths.

Publish website changes through a pull request to `main`. GitHub Pages deploys the merged files automatically. To roll back a website release, revert its pull request while retaining `CNAME` and the existing Pages settings.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [pull request conventions](DEVOPS.md#pull-request-naming-conventions) before proposing a change. Everyone participating in the project must follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Never report a suspected vulnerability in a normal issue or pull request. Follow [SECURITY.md](SECURITY.md).

## License

No open-source license is currently granted. See [LICENSE](LICENSE).
