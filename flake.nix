{
  description = "Dev environment for Moonlight";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_22
            pnpm
            python3
          ];

          shellHook = ''
            echo "Node: $(node --version)"
            echo "pnpm: $(pnpm --version)"
            echo ""

            if [ ! -d node_modules ]; then
              echo "Installing dependencies..."
              pnpm install
            fi

            echo "Starting dev server..."
            pnpm dev
          '';
        };

        apps.dev = flake-utils.lib.mkApp {
          drv = pkgs.writeShellApplication {
            name = "dev";
            runtimeInputs = [ pkgs.nodejs_22 pkgs.pnpm ];
            text = ''
              if [ ! -d node_modules ]; then
                echo "Installing dependencies..."
                pnpm install
              fi

              exec pnpm dev
            '';
          };
        };
      });
}