{
  description = "build kompismoln.se";

  inputs = {
    nixpkgs.url = "github:kompismoln/nixpkgs/nixos-unstable";
  };

  outputs =
    {
      self,
      nixpkgs,
    }:
    let
      name = "kompismoln-site";
      version = "0.0.1";
      src = ./.;
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {

      packages.${system} = {
      };

      devShells.${system} = {
        default = pkgs.mkShell {
          name = "${name}-dev";
          packages = with pkgs; [
            node2nix
            nodejs_23
            nodePackages.svelte-language-server
            nodePackages.typescript-language-server
          ];
        };
      };
    };
}
