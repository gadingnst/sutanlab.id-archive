#!/usr/bin/env bash

# ------------------------------------------------------------------------------
#
# Program: initpost.sh
# Author: Vitor Britto
# Modified by: Gading Nasution.
# Description: script to create an initial structure for my posts.
#
# Usage: ./initpost.sh [options] <post name>
#
# Options:
#   -h, --help        output instructions
#   -c, --create      create post
#   -d, --draft       create draft post
#
# Alias: alias ipost="bash ~/path/to/script/initpost.sh"
#
# Example:
#   ./initpost.sh -c How to replace strings with sed
#
# Important Notes:
#   - This script was created to generate new markdown files for my blog.
#
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# | VARIABLES                                                                  |
# ------------------------------------------------------------------------------

# CORE: Do not change these lines
# ----------------------------------------------------------------
POST_TITLE="${@:2:$(($#-1))}"
POST_NAME="$(echo ${@:2:$(($#-1))} | sed -e 's/ /-/g' | sed "y/ABCDEFGHIJKLMNOPQRSTUVWXYZ/abcdefghijklmnopqrstuvwxyz/")"
CURRENT_YEARMONTH="$(date +'%Y/%m')"
CURRENT_DATE="$(date +'%Y-%m-%d')"
# TIME=$(date +"%T")
# ----------------------------------------------------------------


# SETTINGS: your configuration goes here
# ----------------------------------------------------------------

# Set your destination folder
BINPATH=$(cd `dirname $0`; pwd)
SRCPATH="${BINPATH}/src"
POSTPATH="${SRCPATH}/contents/posts/published"
DRAFTPATH="${SRCPATH}/contents/posts/drafts"
BLOGMEDIAPATH="${BINPATH}/public/media/blog"
RAND_NUM=$(node -e "console.log(~~(Math.random() * 8) + 0)")

if [[ "${1}" == "-c" || "${1}" == "--create" ]]; then
    DIST_FOLDER="$POSTPATH"
    FILE_NAME="${POST_NAME}/index.md"
fi

if [[ "${1}" == "-d" || "${1}" == "--draft" ]]; then
    DIST_FOLDER="$DRAFTPATH"
    FILE_NAME="${POST_NAME}/index.md"
fi

if [[ "${1}" == "-p" || "${1}" == "--publish" ]]; then
    DIST_FOLDER="$POSTPATH"
    FILE_NAME="${POST_NAME}/index.md"
fi

# ----------------------------------------------------------------



# ------------------------------------------------------------------------------
# | UTILS                                                                      |
# ------------------------------------------------------------------------------

# Header logging
e_header() {
    printf "$(tput setaf 38)→ %s$(tput sgr0)\n" "$@"
}

# Success logging
e_success() {
    printf "$(tput setaf 76)✔ %s$(tput sgr0)\n" "$@"
}

# Error logging
e_error() {
    printf "$(tput setaf 1)✖ %s$(tput sgr0)\n" "$@"
}

# Warning logging
e_warning() {
    printf "$(tput setaf 3)! %s$(tput sgr0)\n" "$@"
}



# ------------------------------------------------------------------------------
# | MAIN FUNCTIONS                                                             |
# ------------------------------------------------------------------------------

# Everybody need some help
initpost_help() {

cat <<EOT
------------------------------------------------------------------------------
INIT POST - A shortcut to create an initial structure for my posts.
------------------------------------------------------------------------------
Usage: ./post.sh [options] <post name>
Options:
  -h, --help        output instructions
  -c, --create      create post
  -d, --draft       create draft post
  -p, --publish     publish/promote a draft to a post
Example:
  ./post.sh -c How to replace strings with sed
Important Notes:
  - This script was created to generate new text files to my blog.
Copyright (c) Vitor Britto './initpost.sh' (Modified by Sutan Nst.)
Licensed under the MIT license.
------------------------------------------------------------------------------
EOT

}

# Initial Content
initpost_content() {
    echo "---"
    echo "title: \"${POST_TITLE}\""
    echo "slug: \"${POST_NAME}\""
    echo "date: ${CURRENT_DATE}"
    echo "description: \"\""
    echo "keywords: \"\""
    echo "tags: []"
    echo "image: \"/media/banners/${RAND_NUM}.jpg\""
    echo "sourceCSS: []"
    echo "sourceJS: []"
    echo "---"
}

# Create post
initpost_file() {
    if [ ! -f "$FILE_NAME" ]; then
        e_header "Creating template..."
        mkdir -p "${DIST_FOLDER}/${POST_NAME}"
        mkdir -p "${BLOGMEDIAPATH}/${POST_NAME}"
        initpost_content > "${DIST_FOLDER}/${FILE_NAME}"
        e_success "Initial post successfully created!"
    else
        e_warning "File already exist."
        exit 1
    fi

}

# Create draft
initdraft_file() {
    if [ ! -f "$FILE_NAME" ]; then
        e_header "Creating draft template..."
        mkdir -p "${DIST_FOLDER}/${POST_NAME}"
        initpost_content > "${DIST_FOLDER}/${FILE_NAME}"
        e_success "Initial draft successfully created!"
    else
        e_warning "File already exist."
        exit 1
    fi
}

# Promote draft
promote_draft() {
    if [ ! -f "$FILE_NAME" ]; then
        e_header "Promoting draft..."
        if [ -f "${DRAFTPATH}/${FILE_NAME}" ]; then
          if mkdir -p "${POSTPATH}/${POST_NAME}" && mv "${DRAFTPATH}/${FILE_NAME}" "${POSTPATH}/${FILE_NAME}"; then
              mkdir -p "${BLOGMEDIAPATH}/${POST_NAME}"
              sed -i -e "s/date: .*/date: ${CURRENT_DATE}/" ${POSTPATH}/${FILE_NAME}
              rm -rf "${DRAFTPATH}/${POST_NAME}"
              e_success "Draft promoted successfully!"
          else
              e_warning "File already exists or draft promotion failed."
              exit 1
          fi
        else
          e_warning "File not exists."
          exit 1
        fi
    fi
}

# ------------------------------------------------------------------------------
# | INITIALIZE PROGRAM                                                         |
# ------------------------------------------------------------------------------

main() {

    # Show help
    if [[ "${1}" == "-h" || "${1}" == "--help" ]]; then
        initpost_help ${1}
        exit
    fi

    # Create
    if [[ "${1}" == "-c" || "${1}" == "--create" ]]; then
        initpost_file $*
        exit
    fi

    # Draft
    if [[ "${1}" == "-d" || "${1}" == "--draft" ]]; then
        initdraft_file $*
        exit
    fi

    # Promote
    if [[ "${1}" == "-p" || "${1}" == "--promote" ]]; then
        promote_draft $*
        exit
    fi

}

# Initialize
main $*
