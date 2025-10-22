cd ./ansible

# ls 

ANSIBLE_PRIVATE_KEY_FILE=$1 \
ENVIRONMENT=$2 \
ansible-playbook ./playbook.yaml

# ANSIBLE_PRIVATE_KEY_FILE=$1 ENVIRONMENT=$2 ansible-inventory --list
